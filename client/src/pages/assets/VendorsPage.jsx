import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { Building2, Plus, Trash2, ArrowLeft, Globe, Mail, Phone } from 'lucide-react';

export const VendorsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
  });

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await API.get('/inventory/vendors');
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      return API.post('/inventory/vendors', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
      setIsModalOpen(false);
      setFormData({ name: '', contactPerson: '', email: '', phone: '', website: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return API.delete(`/inventory/vendors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/assets"
            className="p-1.5 rounded text-text-muted hover:text-text-main hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-text-main flex items-center gap-2">
              <Building2 className="w-6 h-6 text-brand" />
              <span>Hardware Vendors</span>
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Authorized hardware manufacturers and procurement suppliers directory.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-text-muted">Loading vendor directory...</div>
      ) : vendors.length === 0 ? (
        <div className="p-8 text-center text-xs text-text-muted">No hardware vendors registered yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((v) => (
            <div
              key={v._id}
              className="bg-surface rounded border border-border p-5 shadow-subtle space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="font-serif font-bold text-text-main text-base">{v.name}</h3>
                  <button
                    onClick={() => {
                      if (confirm(`Remove vendor '${v.name}'?`)) deleteMutation.mutate(v._id);
                    }}
                    className="p-1 text-text-muted hover:text-status-breached rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 space-y-1.5 text-xs text-text-muted">
                  <p className="font-medium text-text-main">Contact: {v.contactPerson || 'N/A'}</p>
                  {v.email && (
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand" />
                      <span>{v.email}</span>
                    </p>
                  )}
                  {v.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand" />
                      <span>{v.phone}</span>
                    </p>
                  )}
                  {v.website && (
                    <p className="flex items-center gap-1.5 pt-1">
                      <Globe className="w-3.5 h-3.5 text-brand" />
                      <a href={v.website} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                        {v.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded border border-border w-full max-w-md p-6 shadow-md space-y-4">
            <h2 className="text-lg font-serif font-bold text-text-main border-b border-border pb-2">
              Register Hardware Vendor
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell Enterprise Solutions"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="sales@vendor.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1-800-..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-border text-text-muted text-xs font-medium rounded hover:bg-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-3.5 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Saving...' : 'Save Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
