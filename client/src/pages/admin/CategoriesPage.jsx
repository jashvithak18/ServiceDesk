import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import { Sliders, Plus, Edit2, Trash2, Tag, Search } from 'lucide-react';

export const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultPriority: 'medium',
    department: '',
  });

  // Fetch Categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await API.get('/admin/categories');
      return res.data.data;
    },
  });

  // Fetch Departments for dropdown
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await API.get('/admin/departments');
      return res.data.data;
    },
  });

  // Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingCategory) {
        return API.put(`/admin/categories/${editingCategory._id}`, payload);
      }
      return API.post('/admin/categories', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return API.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', defaultPriority: 'medium', department: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      defaultPriority: cat.defaultPriority || 'medium',
      department: cat.department?._id || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.department?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityPill = (p) => {
    switch (p) {
      case 'critical': return 'bg-status-breached/15 text-status-breached border-status-breached/30';
      case 'high': return 'bg-status-inProgress/15 text-status-inProgress border-status-inProgress/30';
      case 'medium': return 'bg-status-open/15 text-status-open border-status-open/30';
      default: return 'bg-status-onHold/15 text-status-onHold border-status-onHold/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main flex items-center gap-2">
            <Tag className="w-6 h-6 text-brand" />
            <span>Ticket Categories</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Configure triage categories, default priority levels, and department routing.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter categories or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand"
          />
        </div>
        <div className="text-xs text-text-muted">
          Active Categories: <span className="font-semibold text-text-main">{filteredCategories.length}</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface rounded border border-border overflow-hidden shadow-subtle">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-sm font-serif font-semibold text-text-main">No categories available</p>
            <p className="text-xs text-text-muted">Add categories to enable ticket classification.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-base text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Target Department</th>
                <th className="py-3 px-4">Default Priority</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredCategories.map((cat) => (
                <tr key={cat._id} className="hover:bg-base/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-text-main">{cat.name}</td>
                  <td className="py-3 px-4">
                    {cat.department ? (
                      <span className="px-2 py-0.5 rounded bg-base border border-border text-text-main font-mono text-2xs">
                        {cat.department.name} ({cat.department.code})
                      </span>
                    ) : (
                      <span className="text-text-muted italic">Global</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold uppercase border ${getPriorityPill(cat.defaultPriority)}`}>
                      {cat.defaultPriority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-muted">{cat.description || '—'}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1 text-text-muted hover:text-brand rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category '${cat.name}'?`)) {
                          deleteMutation.mutate(cat._id);
                        }
                      }}
                      className="p-1 text-text-muted hover:text-status-breached rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded border border-border w-full max-w-md p-6 shadow-md space-y-4">
            <h2 className="text-lg font-serif font-bold text-text-main border-b border-border pb-2">
              {editingCategory ? 'Edit Ticket Category' : 'Create Ticket Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hardware & Laptop Repair"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Assigned Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                >
                  <option value="">-- Global / Cross-Department --</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Default Priority Level</label>
                <select
                  value={formData.defaultPriority}
                  onChange={(e) => setFormData({ ...formData, defaultPriority: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Severity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Scope and description of tickets matching this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                ></textarea>
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
                  {saveMutation.isPending ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
