import { TicketCategory } from '../models/TicketCategory.js';

/**
 * Heuristic/semantic fallback classifier used when remote AI API is unconfigured or unavailable.
 */
const fallbackClassify = async (title = '', description = '') => {
  const content = `${title} ${description}`.toLowerCase();
  const categories = await TicketCategory.find();

  let categoryName = 'Software & Application License';
  let priority = 'medium';
  let probableCause = 'Standard software or application request. Requires technician review.';

  if (content.includes('macbook') || content.includes('laptop') || content.includes('hdmi') || content.includes('screen') || content.includes('monitor') || content.includes('hardware') || content.includes('battery')) {
    categoryName = 'Hardware & Laptop Provisioning';
    priority = 'high';
    probableCause = 'Hardware port degradation, display adapter failure, or peripheral connection bottleneck.';
  } else if (content.includes('password') || content.includes('vpn') || content.includes('auth') || content.includes('sso') || content.includes('access') || content.includes('permission') || content.includes('login')) {
    categoryName = 'Identity & Access Management (IAM)';
    priority = 'critical';
    probableCause = 'SSL handshake expiration, expired credentials, or multi-factor authentication token desync.';
  } else if (content.includes('outage') || content.includes('server') || content.includes('crash') || content.includes('latency') || content.includes('down') || content.includes('database') || content.includes('network')) {
    categoryName = 'Network & Cloud Outage';
    priority = 'critical';
    probableCause = 'Database connection pool saturation, gateway timeout, or network switch hardware fault.';
  } else if (content.includes('payroll') || content.includes('salary') || content.includes('deposit') || content.includes('benefit') || content.includes('hr')) {
    categoryName = 'Payroll & Benefits Support';
    priority = 'medium';
    probableCause = 'Human Resources portal account sync delay or pending direct deposit cut-off verification.';
  }

  const matchedCat = categories.find((c) => c.name.toLowerCase().includes(categoryName.toLowerCase())) || categories[0];

  return {
    isAiFallback: true,
    suggestedCategoryId: matchedCat?._id || null,
    suggestedCategoryName: matchedCat?.name || categoryName,
    suggestedPriority: priority,
    probableCauseSummary: probableCause,
  };
};

/**
 * Helper to extract valid JSON object from LLM response string even if wrapped in markdown codeblocks.
 */
const extractJsonObject = (rawText = '') => {
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(rawText);
  } catch (e) {
    console.warn('[AI Service Warning] Failed to parse JSON from AI response:', rawText);
    return {};
  }
};

/**
 * Classifies ticket title and description into category, priority, and probable root cause using Groq LLM API (or OpenAI/Claude).
 */
export const classifyTicketContent = async (title, description) => {
  const apiKey = process.env.AI_API_KEY;
  const provider = process.env.AI_PROVIDER || 'groq';

  // If no API key is provided, execute fallback classifier immediately
  if (!apiKey || provider === 'none') {
    return await fallbackClassify(title, description);
  }

  try {
    // Timeout wrapper to guarantee AI call completes in <= 4000ms
    const aiPromise = (async () => {
      let endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      let model = process.env.AI_MODEL || 'groq/compound';

      if (provider === 'openai') {
        endpoint = 'https://api.openai.com/v1/chat/completions';
        model = process.env.AI_MODEL || 'gpt-4o-mini';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an IT Helpdesk AI Assistant. Analyze ticket title and description. Respond ONLY with valid JSON matching this schema: {"category": "category name", "priority": "low|medium|high|critical", "probableCause": "1-2 sentence probable root cause breakdown"}',
            },
            {
              role: 'user',
              content: `Title: ${title}\nDescription: ${description}`,
            },
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`AI Provider API responded with status ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const contentText = data.choices?.[0]?.message?.content || '{}';
      const parsed = extractJsonObject(contentText);

      const categories = await TicketCategory.find();
      const matched = categories.find((c) =>
        c.name.toLowerCase().includes((parsed.category || '').toLowerCase())
      ) || categories[0];

      return {
        isAiFallback: false,
        aiModel: model,
        suggestedCategoryId: matched?._id || null,
        suggestedCategoryName: matched?.name || parsed.category || 'General Support',
        suggestedPriority: (parsed.priority || 'medium').toLowerCase(),
        probableCauseSummary: parsed.probableCause || 'AI root cause diagnostic complete.',
      };
    })();

    // 10 second timeout guarantee for Groq LLM response
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI API timeout after 10000ms')), 10000)
    );

    return await Promise.race([aiPromise, timeoutPromise]);
  } catch (err) {
    console.warn('[AI Service Warning] Groq/Remote AI call failed or timed out. Falling back to local classifier:', err.message);
    return await fallbackClassify(title, description);
  }
};
