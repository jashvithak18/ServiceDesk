import React from 'react';
import { BookOpen, ExternalLink, Sparkles, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AiKbSuggestionsPanel = ({ categoryName, ticketTitle }) => {
  // Simulated dynamic KB matches based on ticket content / category
  const suggestedArticles = [
    {
      id: 'kb-1',
      title: 'Troubleshooting External Display & HDMI Adapter Faults',
      category: 'Hardware',
      views: 142,
      upvotes: 28,
      snippet: 'Ensure macOS Display Settings arrangement is set to extended desktop. Reset NVRAM if USB-C Alt Mode drops signal.',
    },
    {
      id: 'kb-2',
      title: 'Resolving Corporate VPN SSL Handshake Timeouts',
      category: 'Network & IAM',
      views: 310,
      upvotes: 64,
      snippet: 'Verify UDP port 4500 is unblocked by home router ISP. Clear local DNS resolver cache using `sudo dscacheutil -flushcache`.',
    },
    {
      id: 'kb-3',
      title: 'Requesting & Allocating SaaS Developer Software Seats',
      category: 'Software',
      views: 95,
      upvotes: 19,
      snippet: 'Submit manager approval receipt via Finance portal for instant license key provisioning.',
    },
  ];

  return (
    <div className="bg-surface rounded border border-border p-5 shadow-subtle space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h3 className="text-xs font-serif font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>AI Recommended KB Articles</span>
        </h3>
        <span className="text-[10px] font-semibold text-brand bg-brand-light px-2 py-0.5 rounded border border-brand-border">
          Top 3 Matches
        </span>
      </div>

      <div className="space-y-2.5">
        {suggestedArticles.map((art) => (
          <div key={art.id} className="p-2.5 rounded bg-base border border-border space-y-1 hover:border-brand/40 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-xs font-semibold text-text-main font-serif leading-tight">{art.title}</h4>
              <span className="text-[10px] font-mono text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border shrink-0">
                {art.category}
              </span>
            </div>
            <p className="text-2xs text-text-muted line-clamp-2 leading-relaxed">{art.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
