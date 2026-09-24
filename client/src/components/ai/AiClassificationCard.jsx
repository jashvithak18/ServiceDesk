import React, { useState } from 'react';
import API from '../../api/axios';
import { Sparkles, Check, Info, Bot } from 'lucide-react';

export const AiClassificationCard = ({ title, description, onApplySuggestion }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [applied, setApplied] = useState(false);

  const handleAnalyze = async () => {
    if (!title && !description) return;
    setLoading(true);
    setApplied(false);

    try {
      const res = await API.post('/ai/classify', { title, description });
      if (res.data.success) {
        setSuggestion(res.data.data);
      }
    } catch (err) {
      console.error('AI Classification Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!suggestion) return;
    onApplySuggestion(suggestion);
    setApplied(true);
  };

  if (!title && !description) {
    return null;
  }

  return (
    <div className="rounded border border-brand-border/60 bg-brand-light/40 p-4 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-brand text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold text-text-main">AI Ticket Triage & Classification</h4>
            <p className="text-[11px] text-text-muted">Live Machine Learning category and priority predictor</p>
          </div>
        </div>

        {!suggestion && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-white text-2xs font-semibold rounded hover:bg-brand-hover disabled:opacity-50 transition-colors shadow-xs"
          >
            {loading ? (
              <span>Analyzing Issue...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI Classification</span>
              </>
            )}
          </button>
        )}
      </div>

      {suggestion && (
        <div className="pt-2 border-t border-brand-border/40 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded bg-surface border border-border">
              <span className="text-[10px] uppercase font-semibold text-text-muted block">Suggested Category</span>
              <span className="font-semibold text-brand font-serif">{suggestion.suggestedCategoryName}</span>
            </div>

            <div className="p-2 rounded bg-surface border border-border">
              <span className="text-[10px] uppercase font-semibold text-text-muted block">Suggested Priority</span>
              <span className="font-mono font-bold uppercase text-text-main">{suggestion.suggestedPriority}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-surface border border-border space-y-1">
            <span className="text-[10px] uppercase font-semibold text-text-muted block flex items-center gap-1">
              <Info className="w-3 h-3 text-brand" />
              Probable Cause Breakdown
            </span>
            <p className="text-xs text-text-main leading-relaxed">{suggestion.probableCauseSummary}</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-2xs text-text-muted">
              {suggestion.isAiFallback ? 'Classified via Heuristic Model' : 'Classified via LLM Engine'}
            </span>

            {applied ? (
              <span className="inline-flex items-center gap-1 text-2xs font-semibold text-status-resolved">
                <Check className="w-3.5 h-3.5" />
                AI Suggestions Applied
              </span>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-1 px-3 py-1 bg-brand text-white text-2xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply AI Suggestions to Form</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
