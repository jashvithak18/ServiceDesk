import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import { Clock, Plus, Edit2, ShieldAlert, Check, Calendar } from 'lucide-react';

export const SLAPoliciesPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    priorityLevel: 'medium',
    responseTimeMinutes: 60,
    resolutionTimeMinutes: 480,
    businessHoursOnly: true,
  });

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ['slaPolicies'],
    queryFn: async () => {
      const res = await API.get('/admin/sla-policies');
      return res.data.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingPolicy) {
        return API.put(`/admin/sla-policies/${editingPolicy._id}`, payload);
      }
      return API.post('/admin/sla-policies', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['slaPolicies']);
      closeModal();
    },
  });

  const openCreateModal = () => {
    setEditingPolicy(null);
    setFormData({
      name: '',
      priorityLevel: 'medium',
      responseTimeMinutes: 60,
      resolutionTimeMinutes: 480,
      businessHoursOnly: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPolicy(p);
    setFormData({
      name: p.name,
      priorityLevel: p.priorityLevel,
      responseTimeMinutes: p.responseTimeMinutes,
      resolutionTimeMinutes: p.resolutionTimeMinutes,
      businessHoursOnly: p.businessHoursOnly,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPolicy(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const formatDuration = (mins) => {
    if (mins < 60) return `${mins} mins`;
    const hrs = (mins / 60).toFixed(mins % 60 === 0 ? 0 : 1);
    return `${hrs} hrs (${mins} mins)`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main flex items-center gap-2">
            <Clock className="w-6 h-6 text-brand" />
            <span>Service Level Agreements (SLA)</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Define target response and resolution deadlines per ticket priority level with business-hours math.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Configure SLA Policy</span>
        </button>
      </div>

      {/* SLA Policy Grid Cards */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-text-muted">Loading SLA policies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {policies.map((p) => (
            <div
              key={p._id}
              className="bg-surface border border-border rounded p-5 space-y-4 shadow-subtle hover:border-brand/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wide text-brand">
                    {p.priorityLevel} priority
                  </span>
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1 text-text-muted hover:text-brand rounded"
                    title="Edit Policy"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-serif font-bold text-text-main text-base">{p.name}</h3>

                <div className="pt-2 space-y-2 text-xs border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">First Response Target:</span>
                    <span className="font-semibold text-text-main font-mono">{formatDuration(p.responseTimeMinutes)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Full Resolution Target:</span>
                    <span className="font-semibold text-text-main font-mono">{formatDuration(p.resolutionTimeMinutes)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-2xs">
                    <span className="text-text-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-brand" />
                      Calendar Rule:
                    </span>
                    <span className="font-medium text-text-main">
                      {p.businessHoursOnly ? 'Mon-Fri (9AM-6PM)' : '24/7 Continuous'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-2xs text-text-muted">
                <span>Escalation: Auto Manager Alert</span>
                <span className="w-2 h-2 rounded-full bg-status-resolved"></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded border border-border w-full max-w-md p-6 shadow-md space-y-4">
            <h2 className="text-lg font-serif font-bold text-text-main border-b border-border pb-2">
              {editingPolicy ? 'Edit SLA Policy' : 'Configure New SLA Policy'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Policy Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Incident SLA"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Priority Level</label>
                <select
                  value={formData.priorityLevel}
                  onChange={(e) => setFormData({ ...formData, priorityLevel: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">Response Target (mins)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={formData.responseTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, responseTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-mono bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                  />
                  <p className="text-[10px] text-text-muted mt-0.5">{formatDuration(formData.responseTimeMinutes)}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">Resolution Target (mins)</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={formData.resolutionTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, resolutionTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-mono bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                  />
                  <p className="text-[10px] text-text-muted mt-0.5">{formatDuration(formData.resolutionTimeMinutes)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="businessHoursOnly"
                  checked={formData.businessHoursOnly}
                  onChange={(e) => setFormData({ ...formData, businessHoursOnly: e.target.checked })}
                  className="w-4 h-4 text-brand rounded border-border focus:ring-brand"
                />
                <label htmlFor="businessHoursOnly" className="text-xs text-text-main font-medium">
                  Compute deadlines during business hours only (Mon–Fri 9am–6pm)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3.5 py-1.5 border border-border text-text-muted text-xs font-medium rounded hover:bg-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-3.5 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
