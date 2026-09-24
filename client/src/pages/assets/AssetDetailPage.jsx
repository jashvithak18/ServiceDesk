import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  HardDrive, 
  UserCheck, 
  Wrench, 
  PackageCheck, 
  Ban, 
  History, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Building2 
} from 'lucide-react';

export const AssetDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [transitionNotes, setTransitionNotes] = useState('');

  // Fetch Asset Details
  const { data: asset, isLoading } = useQuery({
    queryKey: ['asset', id],
    queryFn: async () => {
      const res = await API.get(`/inventory/assets/${id}`);
      return res.data.data;
    },
  });

  // Fetch Users for assignment
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await API.get('/admin/users');
      return res.data.data;
    },
  });

  // Status Mutation
  const statusMutation = useMutation({
    mutationFn: async (payload) => {
      return API.put(`/inventory/assets/${id}/status`, payload);
    },
    onSuccess: () => {
      setIsAssignModalOpen(false);
      setSelectedUserId('');
      setTransitionNotes('');
      queryClient.invalidateQueries(['asset', id]);
    },
  });

  if (isLoading || !asset) {
    return <div className="p-8 text-center text-xs text-text-muted">Loading asset details...</div>;
  }

  const isRetired = asset.status === 'retired';
  const isAssigned = asset.status === 'assigned';
  const isInStock = asset.status === 'in_stock';
  const isInRepair = asset.status === 'in_repair';

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    statusMutation.mutate({
      status: 'assigned',
      assignedTo: selectedUserId,
      notes: transitionNotes || 'Assigned to user',
    });
  };

  const handleStatusChange = (newStatus, notes) => {
    statusMutation.mutate({
      status: newStatus,
      notes: notes || `Changed status to ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/inventory/assets"
            className="p-1.5 rounded text-text-muted hover:text-text-main hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-brand text-sm">{asset.assetTag}</span>
              <span className="px-2 py-0.5 rounded bg-base border border-border text-2xs font-semibold text-text-main">
                {asset.type}
              </span>
              <span className="status-pill status-in-progress uppercase">
                {asset.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-xl font-serif font-bold text-text-main mt-1">{asset.name}</h1>
          </div>
        </div>

        {/* Lifecycle Actions */}
        <div className="flex items-center gap-2">
          {!isRetired && (
            <>
              {isInStock && (
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Assign Asset</span>
                </button>
              )}

              {isAssigned && (
                <button
                  onClick={() => handleStatusChange('in_stock', 'Returned to IT inventory stock')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-surface text-text-main text-xs font-semibold rounded hover:bg-base transition-colors"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Return to Stock</span>
                </button>
              )}

              {!isInRepair && (
                <button
                  onClick={() => handleStatusChange('in_repair', 'Sent for hardware repair / RMA')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-status-inProgress text-white text-xs font-semibold rounded hover:opacity-90 transition-opacity"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Send to Repair</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to RETIRE asset '${asset.assetTag}'? Retired assets cannot be assigned again.`)) {
                    handleStatusChange('retired', 'Hardware retired and decommissioned');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-status-breached/30 bg-status-breached/10 text-status-breached text-xs font-semibold rounded hover:bg-status-breached/20 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Retire Asset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Columns: Lifecycle History Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded border border-border p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-serif font-bold text-text-main flex items-center gap-2 border-b border-border pb-3">
              <History className="w-4 h-4 text-brand" />
              <span>Hardware Lifecycle Timeline & Audit Trail</span>
            </h3>

            <div className="space-y-4 pt-2">
              {asset.lifecycleHistory.map((h, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-border pb-4 last:pb-0">
                  <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-brand border-2 border-surface"></div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-text-main">
                        Transition: <span className="font-mono text-brand">{h.fromStatus}</span> → <span className="font-mono text-brand">{h.toStatus}</span>
                      </span>
                      <span className="text-2xs text-text-muted">{new Date(h.timestamp).toLocaleString()}</span>
                    </div>
                    {h.assignedTo && (
                      <p className="text-2xs text-text-main font-medium">
                        Assigned User: {h.assignedTo.name} ({h.assignedTo.email})
                      </p>
                    )}
                    <p className="text-text-muted text-2xs">{h.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Asset Specifications & Vendor Details */}
        <div className="space-y-6">
          <div className="bg-surface rounded border border-border p-5 shadow-subtle space-y-4 text-xs">
            <h3 className="text-xs font-serif font-bold text-text-main uppercase tracking-wider border-b border-border pb-2">
              Hardware Details
            </h3>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Serial Number:</span>
                <span className="font-mono font-semibold text-text-main">{asset.serialNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Assigned User:</span>
                <span className="font-semibold text-text-main">
                  {asset.assignedTo ? asset.assignedTo.name : <span className="text-text-muted italic">Unassigned</span>}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Department:</span>
                <span className="font-mono text-text-main">{asset.department?.name || 'Global'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-text-muted">Purchase Cost:</span>
                <span className="font-mono font-semibold text-text-main">${asset.purchaseCost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Warranty Expiry:</span>
                <span className="font-mono font-semibold text-brand">
                  {asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {asset.vendor && (
            <div className="bg-surface rounded border border-border p-5 shadow-subtle space-y-3 text-xs">
              <h3 className="text-xs font-serif font-bold text-text-main uppercase tracking-wider border-b border-border pb-2">
                Vendor Details
              </h3>
              <div className="space-y-1.5">
                <p className="font-semibold text-text-main">{asset.vendor.name}</p>
                <p className="text-text-muted">Contact: {asset.vendor.contactPerson || 'N/A'}</p>
                <p className="text-text-muted">Email: {asset.vendor.email || 'N/A'}</p>
                <p className="text-text-muted">Phone: {asset.vendor.phone || 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-text-main/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded border border-border w-full max-w-md p-6 shadow-md space-y-4">
            <h2 className="text-lg font-serif font-bold text-text-main border-b border-border pb-2">
              Assign Asset to Employee
            </h2>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Select User</label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                >
                  <option value="">-- Choose Employee --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email}) - {u.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Assignment Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Issued for remote developer work"
                  value={transitionNotes}
                  onChange={(e) => setTransitionNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3.5 py-1.5 border border-border text-text-muted text-xs font-medium rounded hover:bg-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusMutation.isPending}
                  className="px-3.5 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover disabled:opacity-50"
                >
                  {statusMutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
