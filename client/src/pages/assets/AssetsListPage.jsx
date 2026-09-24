import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { HardDrive, Plus, Search, AlertTriangle, ShieldCheck, ChevronRight, UserCheck, Wrench, PackageCheck, Ban } from 'lucide-react';

export const AssetsListPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [warrantyFilter, setWarrantyFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    type: 'Laptop',
    vendor: '',
    purchaseCost: 0,
    warrantyExpiry: '',
  });

  // Fetch Assets
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['assets', statusFilter, typeFilter, searchTerm, warrantyFilter],
    queryFn: async () => {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      if (searchTerm) params.search = searchTerm;
      if (warrantyFilter) params.warrantyExpiring = 'true';

      const res = await API.get('/inventory/assets', { params });
      return res.data.data;
    },
  });

  // Fetch Vendors for dropdown
  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await API.get('/inventory/vendors');
      return res.data.data;
    },
  });

  // Create Asset Mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      return API.post('/inventory/assets', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assets']);
      setIsModalOpen(false);
      setFormData({ name: '', serialNumber: '', type: 'Laptop', vendor: '', purchaseCost: 0, warrantyExpiry: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-[#F0F4F8] text-[#3E5C76] border border-[#D0DDE8]">
            <PackageCheck className="w-3 h-3" />
            In Stock
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-[#F1F7F3] text-[#3D6B4F] border border-[#C8E0D2]">
            <UserCheck className="w-3 h-3" />
            Assigned
          </span>
        );
      case 'in_repair':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-[#FAF5EB] text-[#B5822F] border border-[#EDE0C4]">
            <Wrench className="w-3 h-3" />
            In Repair
          </span>
        );
      case 'retired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-[#F4F3F0] text-[#6B6559] border border-[#DDD9D0]">
            <Ban className="w-3 h-3" />
            Retired
          </span>
        );
      default:
        return null;
    }
  };

  const isWarrantyExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const now = new Date().getTime();
    const expiry = new Date(expiryDate).getTime();
    const daysLeft = (expiry - now) / (1000 * 60 * 60 * 24);
    return daysLeft >= 0 && daysLeft <= 30;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-brand" />
            <span>Hardware Asset Inventory</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Track hardware lifecycle transitions from procurement, user assignment, repair, to retirement.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/inventory/vendors"
            className="px-3.5 py-2 border border-border bg-surface text-text-main text-xs font-semibold rounded hover:bg-base transition-colors"
          >
            Manage Vendors
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Asset</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Tag, Serial, or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main focus:outline-none focus:border-brand"
          >
            <option value="">All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="assigned">Assigned</option>
            <option value="in_repair">In Repair</option>
            <option value="retired">Retired</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main focus:outline-none focus:border-brand"
          >
            <option value="">All Types</option>
            <option value="Laptop">Laptop</option>
            <option value="Monitor">Monitor</option>
            <option value="Server">Server</option>
            <option value="Mobile">Mobile</option>
            <option value="Peripherals">Peripherals</option>
          </select>

          <button
            onClick={() => setWarrantyFilter(!warrantyFilter)}
            className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
              warrantyFilter
                ? 'bg-status-inProgress/15 border-status-inProgress/40 text-status-inProgress font-semibold'
                : 'bg-surface border-border text-text-muted hover:text-text-main'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Warranty Expiring Soon (30d)</span>
          </button>
        </div>

        <div className="text-xs text-text-muted">
          Total Hardware: <span className="font-semibold text-text-main">{assets.length}</span>
        </div>
      </div>

      {/* Inventory Data Table */}
      <div className="bg-surface rounded border border-border overflow-hidden shadow-subtle">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading asset inventory...</div>
        ) : assets.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-base font-serif font-semibold text-text-main">No assets in inventory</p>
            <p className="text-xs text-text-muted">Register hardware assets to track assignment history.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-base text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">Asset Tag</th>
                <th className="py-3 px-4">Device Name & Serial</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Warranty Expiry</th>
                <th className="py-3 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {assets.map((ast) => (
                <tr key={ast._id} className="hover:bg-base/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand">{ast.assetTag}</td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <Link to={`/inventory/assets/${ast._id}`} className="font-semibold text-text-main hover:text-brand transition-colors block truncate">
                      {ast.name}
                    </Link>
                    <span className="font-mono text-2xs text-text-muted">S/N: {ast.serialNumber}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-text-muted">{ast.type}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(ast.status)}</td>
                  <td className="py-3.5 px-4">
                    {ast.assignedTo ? (
                      <span className="font-medium text-text-main">{ast.assignedTo.name}</span>
                    ) : (
                      <span className="text-text-muted italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {ast.warrantyExpiry ? (
                      <span className={`font-mono text-2xs ${isWarrantyExpiringSoon(ast.warrantyExpiry) ? 'text-status-inProgress font-bold flex items-center gap-1' : 'text-text-muted'}`}>
                        {isWarrantyExpiringSoon(ast.warrantyExpiry) && <AlertTriangle className="w-3.5 h-3.5 text-status-inProgress" />}
                        {new Date(ast.warrantyExpiry).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-text-muted">N/A</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/inventory/assets/${ast._id}`}
                      className="inline-flex items-center text-text-muted hover:text-brand transition-colors p-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Register Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded border border-border w-full max-w-md p-6 shadow-md space-y-4">
            <h2 className="text-lg font-serif font-bold text-text-main border-b border-border pb-2">
              Register New Hardware Asset
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Pro 16 M3 Max"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Serial Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. C02G1829MD6R"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono uppercase bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">Asset Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Server">Server</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Peripherals">Peripherals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">Vendor</label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                  >
                    <option value="">-- Direct Procurement --</option>
                    {vendors.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">Purchase Cost ($)</label>
                  <input
                    type="number"
                    value={formData.purchaseCost}
                    onChange={(e) => setFormData({ ...formData, purchaseCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-mono bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">Warranty Expiry</label>
                  <input
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
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
                  {createMutation.isPending ? 'Registering...' : 'Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
