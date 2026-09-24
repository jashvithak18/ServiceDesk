import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Ticket, HardDrive, BookOpen, User, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import API from '../../api/axios';

export const SearchCommandModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ tickets: [], assets: [], articles: [], users: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ tickets: [], assets: [], articles: [], users: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [ticketsRes, assetsRes, kbRes] = await Promise.allSettled([
          API.get(`/tickets?search=${encodeURIComponent(query)}`),
          API.get(`/inventory/assets?search=${encodeURIComponent(query)}`),
          API.get(`/kb?search=${encodeURIComponent(query)}`),
        ]);

        const tickets = ticketsRes.status === 'fulfilled' ? ticketsRes.value.data.data.slice(0, 4) : [];
        const assets = assetsRes.status === 'fulfilled' ? assetsRes.value.data.data.slice(0, 4) : [];
        const articles = kbRes.status === 'fulfilled' ? kbRes.value.data.data.slice(0, 4) : [];

        setResults({ tickets, assets, articles, users: [] });
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  const hasResults =
    results.tickets.length > 0 || results.assets.length > 0 || results.articles.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-2xl overflow-hidden font-sans"
        >
          {/* Search Input Header */}
          <div className="flex items-center px-4 py-3 border-b border-border gap-3">
            <Search className="w-5 h-5 text-brand" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets, hardware assets, knowledge articles... (Ctrl + K)"
              className="w-full text-sm font-medium text-text-main placeholder:text-text-muted bg-transparent focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 rounded hover:bg-slate-100 text-text-muted">
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-xs font-semibold text-text-muted bg-slate-100 px-2 py-1 rounded border border-slate-200"
            >
              ESC
            </button>
          </div>

          {/* Search Results Area */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {loading && (
              <div className="text-center py-8 text-xs font-medium text-text-muted">
                Searching ServiceDesk database...
              </div>
            )}

            {!loading && !query.trim() && (
              <div className="py-6 text-center space-y-2 text-xs text-text-muted">
                <p className="font-semibold text-text-main">Global Command Center</p>
                <p>Type ticket numbers (INC-1001), asset tags (AST-4001), or keywords to search.</p>
              </div>
            )}

            {!loading && query.trim() && !hasResults && (
              <div className="text-center py-8 text-xs text-text-muted">
                No matching records found for "{query}".
              </div>
            )}

            {/* Tickets Category */}
            {results.tickets.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Tickets ({results.tickets.length})</span>
                </div>
                {results.tickets.map((t) => (
                  <button
                    key={t._id}
                    onClick={() => handleSelect(`/tickets/${t._id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-light/50 text-left border border-transparent hover:border-brand/20 transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand">{t.ticketNumber}</span>
                        <span className="text-xs font-semibold text-text-main line-clamp-1">{t.title}</span>
                      </div>
                      <span className="text-[10px] text-text-muted">{t.status} • {t.priority} priority</span>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Assets Category */}
            {results.assets.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-sky-600">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Assets ({results.assets.length})</span>
                </div>
                {results.assets.map((a) => (
                  <button
                    key={a._id}
                    onClick={() => handleSelect(`/inventory/assets/${a._id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 text-left border border-transparent hover:border-sky-200 transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-600">{a.assetTag}</span>
                        <span className="text-xs font-semibold text-text-main line-clamp-1">{a.name}</span>
                      </div>
                      <span className="text-[10px] text-text-muted">{a.category} • Status: {a.status}</span>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Knowledge Base Category */}
            {results.articles.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Knowledge Base ({results.articles.length})</span>
                </div>
                {results.articles.map((art) => (
                  <button
                    key={art._id}
                    onClick={() => handleSelect(`/kb/${art._id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-left border border-transparent hover:border-emerald-200 transition-all group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-text-main line-clamp-1 block">{art.title}</span>
                      <span className="text-[10px] text-text-muted">{art.category} • {art.viewCount || 0} views</span>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-border flex items-center justify-between text-[11px] text-text-muted font-medium">
            <span>Navigation shortcuts</span>
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
