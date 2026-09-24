import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import API from '../../api/axios';
import { AiClassificationCard } from '../../components/ai/AiClassificationCard';
import { PlusCircle, ArrowLeft, Send, AlertCircle, Info } from 'lucide-react';

export const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priorityOverride, setPriorityOverride] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Categories
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await API.get('/admin/categories');
      return res.data.data;
    },
  });

  const selectedCategory = categories.find((c) => c._id === categoryId);

  const handleApplyAiSuggestion = (suggestion) => {
    if (suggestion.suggestedCategoryId) {
      setCategoryId(suggestion.suggestedCategoryId);
    }
    if (suggestion.suggestedPriority) {
      setPriorityOverride(suggestion.suggestedPriority);
    }
  };

  // Submit Mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await API.post('/tickets', payload);
      return res.data.data;
    },
    onSuccess: (newTicket) => {
      navigate(`/tickets/${newTicket._id}`);
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to submit ticket');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !categoryId) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    setErrorMsg('');
    createMutation.mutate({
      title,
      description,
      categoryId,
      priorityOverride: priorityOverride || undefined,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Link
          to="/tickets"
          className="p-1.5 rounded text-text-muted hover:text-text-main hover:bg-surface transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main">Submit Support Request</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Log an incident or request IT assistance. SLA timers will calculate upon creation.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded bg-status-breached/10 border border-status-breached/20 text-status-breached text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-surface rounded border border-border p-6 md:p-8 space-y-5 shadow-subtle">
        {/* AI Triage Card */}
        <AiClassificationCard title={title} description={description} onApplySuggestion={handleApplyAiSuggestion} />

        <div>
          <label className="block text-xs font-semibold text-text-main mb-1.5">
            Issue Category <span className="text-brand">*</span>
          </label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
          >
            <option value="">-- Select Helpdesk Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name} {cat.department ? `(${cat.department.name})` : ''}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <p className="text-2xs text-text-muted mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-brand" />
              Category default priority: <strong className="uppercase font-mono">{selectedCategory.defaultPriority}</strong>.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-main mb-1.5">
            Subject / Ticket Title <span className="text-brand">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Concise summary of the problem (e.g. MacBook HDMI port disconnects)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-main mb-1.5">
            Detailed Description <span className="text-brand">*</span>
          </label>
          <textarea
            required
            rows="6"
            placeholder="Describe what happened, error codes encountered, steps to reproduce, and impacted work..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-main mb-1.5">
            Priority Override (Optional)
          </label>
          <select
            value={priorityOverride}
            onChange={(e) => setPriorityOverride(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
          >
            <option value="">Use Category Default Priority</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="critical">Critical Severity</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            to="/tickets"
            className="px-4 py-2 border border-border text-text-muted text-xs font-medium rounded hover:bg-base transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{createMutation.isPending ? 'Logging Ticket...' : 'Submit Support Ticket'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
