import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import { Users, Search, ShieldCheck, Edit2, CheckCircle2, UserX } from 'lucide-react';

export const UserDirectoryPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    role: 'employee',
    department: '',
    isActive: true,
  });

  // Fetch Users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await API.get('/admin/users');
      return res.data.data;
    },
  });

  // Fetch Departments
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await API.get('/admin/departments');
      return res.data.data;
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      return API.put(`/admin/users/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setEditingUser(null);
    },
  });

  const openEditModal = (u) => {
    setEditingUser(u);
    setFormData({
      role: u.role,
      department: u.department?._id || '',
      isActive: u.isActive,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: editingUser._id, payload: formData });
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-brand-light text-brand border-brand-border';
      case 'it_manager': return 'bg-[#F0F4F8] text-[#3E5C76] border-[#D0DDE8]';
      case 'technician': return 'bg-[#F1F7F3] text-[#3D6B4F] border-[#C8E0D2]';
      case 'asset_manager': return 'bg-[#FAF5EB] text-[#B5822F] border-[#EDE0C4]';
      default: return 'bg-[#F4F3F0] text-[#6B6559] border-[#DDD9D0]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main flex items-center gap-2">
            <Users className="w-6 h-6 text-brand" />
            <span>User Directory & Access Control</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Manage organization users, role assignments (RBAC), and department affiliations.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand"
          />
        </div>
        <div className="text-xs text-text-muted">
          Total Users: <span className="font-semibold text-text-main">{filteredUsers.length}</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface rounded border border-border overflow-hidden shadow-subtle">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading user directory...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-base text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-base/50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded text-white flex items-center justify-center font-bold text-2xs"
                      style={{ backgroundColor: u.avatarColor || '#B5502F' }}
                    >
                      {u.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </div>
                    <span className="font-semibold text-text-main">{u.name}</span>
                  </td>
                  <td className="py-3 px-4 text-text-muted">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold uppercase border ${getRoleBadge(u.role)}`}>
                      <ShieldCheck className="w-3 h-3" />
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {u.department ? (
                      <span className="font-mono text-2xs text-text-main">{u.department.name} ({u.department.code})</span>
                    ) : (
                      <span className="text-text-muted italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-status-resolved font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-status-breached font-medium">
                        <UserX className="w-3.5 h-3.5" />
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1 text-text-muted hover:text-brand rounded transition-colors"
                      title="Manage Access & Department"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-text-main/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded border border-border w-full max-w-md p-6 shadow-md space-y-4">
            <h2 className="text-lg font-serif font-bold text-text-main border-b border-border pb-2">
              Modify User Governance — {editingUser.name}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Assign Role (RBAC)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                >
                  <option value="admin">System Admin</option>
                  <option value="it_manager">IT Manager</option>
                  <option value="technician">Technician</option>
                  <option value="asset_manager">Asset Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Assigned Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                >
                  <option value="">-- No Department Assignment --</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-brand rounded border-border focus:ring-brand"
                />
                <label htmlFor="isActiveCheck" className="text-xs text-text-main font-medium">
                  Account Active (Uncheck to disable access)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-1.5 border border-border text-text-muted text-xs font-medium rounded hover:bg-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-3.5 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Update Permissions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
