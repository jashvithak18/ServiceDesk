import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Search, ThumbsUp, Eye, Plus, Tag, ChevronRight, Sparkles } from 'lucide-react';

export const KnowledgeBasePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    categoryId: '',
    tags: '',
  });

  // Fetch Categories for dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await API.get('/admin/categories');
      return res.data.data;
    },
  });

  // Fetch Articles
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['kbArticles', searchTerm, selectedTag],
    queryFn: async () => {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedTag) params.tag = selectedTag;

      const res = await API.get('/kb', { params });
      return res.data.data;
    },
  });

  // Create Article Mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      return API.post('/kb', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['kbArticles']);
      setIsModalOpen(false);
      setFormData({ title: '', body: '', categoryId: '', tags: '' });
    },
  });

  const isTechOrAdmin = ['admin', 'it_manager', 'technician'].includes(user?.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const sampleTags = ['hardware', 'vpn', 'software', 'iam', 'macbook', 'dns', 'license'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search Hero Header */}
      <div className="bg-surface rounded border border-border p-8 text-center space-y-4 shadow-subtle">
        <div className="w-12 h-12 rounded bg-brand-light text-brand flex items-center justify-center mx-auto border border-brand-border">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="max-w-xl mx-auto space-y-1">
          <h1 className="text-2xl font-serif font-bold text-text-main">Knowledge Base & Self-Service Portal</h1>
          <p className="text-xs text-text-muted">
            Search verified IT troubleshooting guides, SaaS licensing documentation, and corporate network procedures.
          </p>
        </div>

        {/* Big Search Input */}
        <div className="max-w-xl mx-auto relative">
          <Search className="w-5 h-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type keywords (e.g. 'MacBook HDMI', 'VPN SSL timeout', 'IntelliJ')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs bg-base border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-xs"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-2xs">
          <span className="text-text-muted font-medium">Popular Tags:</span>
          {sampleTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(selectedTag === t ? '' : t)}
              className={`px-2.5 py-1 rounded font-mono border transition-colors ${
                selectedTag === t
                  ? 'bg-brand text-white border-brand font-semibold'
                  : 'bg-base border-border text-text-muted hover:border-brand hover:text-brand'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-base font-serif font-bold text-text-main flex items-center gap-2">
          <span>Documentation Articles</span>
          <span className="text-xs text-text-muted font-sans font-normal">({articles.length} published)</span>
        </h2>

        {isTechOrAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Article</span>
          </button>
        )}
      </div>

      {/* Article Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-text-muted">Searching Knowledge Base...</div>
      ) : articles.length === 0 ? (
        <div className="p-12 text-center text-xs text-text-muted italic bg-surface rounded border border-border">
          No Knowledge Base articles match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <Link
              key={art._id}
              to={`/kb/${art._id}`}
              className="bg-surface rounded border border-border p-5 shadow-subtle hover:border-brand/40 transition-colors flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-base border border-border text-2xs font-semibold text-brand font-mono">
                    {art.category?.name || 'General Support'}
                  </span>
                  <div className="flex items-center gap-3 text-2xs text-text-muted font-mono">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-brand" />
                      {art.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-text-muted" />
                      {art.views}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-serif font-bold text-text-main group-hover:text-brand transition-colors">
                  {art.title}
                </h3>

                <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                  {art.body.replace(/[#*`]/g, '')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border text-2xs text-text-muted">
                <span className="flex items-center gap-1">
                  Author: <strong className="text-text-main font-sans">{art.createdBy?.name || 'IT Staff'}</strong>
                </span>
                <span className="inline-flex items-center gap-1 text-brand font-semibold group-hover:translate-x-0.5 transition-transform">
                  Read Article
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Publish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded border border-border w-full max-w-lg p-6 shadow-md space-y-4">
            <h2 className="text-lg font-serif font-bold text-text-main border-b border-border pb-2">
              Publish Knowledge Base Article
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Troubleshooting WiFi Router Disconnects"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. vpn, network, macbook, ssl"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Article Body (Markdown / Text)</label>
                <textarea
                  required
                  rows="6"
                  placeholder="Provide detailed step-by-step resolution steps..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand font-sans"
                ></textarea>
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
                  {createMutation.isPending ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
