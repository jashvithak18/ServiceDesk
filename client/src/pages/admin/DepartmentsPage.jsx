import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import { Building2, Plus, Edit2, Trash2, Search, CheckCircle2 } from 'lucide-react';

export const DepartmentsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  // Fetch Departments
  const { data: departmentsResponse, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await API.get('/admin/departments');
      return res.data.data;
    },
  });

  // Create / Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingDept) {
        return API.put(`/admin/departments/${editingDept._id}`, payload);
      }
      return API.post('/admin/departments', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      closeModal();
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return API.delete(`/admin/departments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
    },
  });

  const openCreateModal = () => {
    setEditingDept(null);
    setFormData({ name: '', code: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, code: dept.code, description: dept.description || '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const departments = departmentsResponse || [];
  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand" />
            <span>Departments Directory</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Manage organizational divisions, departmental prefixes, and governance leads.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand"
          />
        </div>
        <div className="text-xs text-text-muted">
          Showing <span className="font-semibold text-text-main">{filteredDepartments.length}</span> departments
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface rounded border border-border overflow-hidden shadow-subtle">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading department data...</div>
        ) : filteredDepartments.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-sm font-serif font-semibold text-text-main">No departments found</p>
            <p className="text-xs text-text-muted">Create a new department to get started.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-base text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">Dept Code</th>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredDepartments.map((dept) => (
                <tr key={dept._id} className="hover:bg-base/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-brand">{dept.code}</td>
                  <td className="py-3 px-4 font-semibold text-text-main">{dept.name}</td>
                  <td className="py-3 px-4 text-text-muted">{dept.description || '—'}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-status-resolved font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(dept)}
                      className="p-1 text-text-muted hover:text-brand rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete department '${dept.name}'?`)) {
                          deleteMutation.mutate(dept._id);
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

      {/* Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded border border-border w-full max-w-md p-6 shadow-md space-y-4">
            <h2 className="text-lg font-serif font-bold text-text-main border-b border-border pb-2">
              {editingDept ? 'Edit Department' : 'Create New Department'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Information Technology"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Code (Short Prefix)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IT"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs font-mono uppercase bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Summary of departmental responsibilities..."
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
                  {saveMutation.isPending ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
