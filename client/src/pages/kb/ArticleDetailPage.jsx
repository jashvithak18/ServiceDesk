import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import { ArrowLeft, ThumbsUp, Eye, BookOpen, Calendar, Tag, User } from 'lucide-react';

export const ArticleDetailPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Fetch Article Details
  const { data: article, isLoading } = useQuery({
    queryKey: ['kbArticle', id],
    queryFn: async () => {
      const res = await API.get(`/kb/${id}`);
      return res.data.data;
    },
  });

  // Upvote Mutation
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      return API.post(`/kb/${id}/upvote`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['kbArticle', id]);
    },
  });

  if (isLoading || !article) {
    return <div className="p-8 text-center text-xs text-text-muted">Loading documentation article...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Back Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          to="/kb"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-surface text-text-main text-xs font-semibold rounded hover:bg-base transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Base</span>
        </Link>

        <button
          onClick={() => upvoteMutation.mutate()}
          disabled={upvoteMutation.isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-light border border-brand-border text-brand text-xs font-semibold rounded hover:bg-brand-light/80 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Helpful Article ({article.upvotes})</span>
        </button>
      </div>

      {/* Article Container */}
      <div className="bg-surface rounded border border-border p-6 md:p-10 space-y-6 shadow-subtle">
        {/* Category & Title */}
        <div className="space-y-2 border-b border-border pb-5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-base border border-border text-2xs font-semibold text-brand font-mono">
              {article.category?.name}
            </span>
            <span className="text-2xs text-text-muted flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views} reads
            </span>
          </div>

          <h1 className="text-2xl font-serif font-bold text-text-main leading-tight">{article.title}</h1>

          <div className="flex items-center gap-4 text-xs text-text-muted pt-2">
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded text-white flex items-center justify-center font-bold text-[10px]"
                style={{ backgroundColor: article.createdBy?.avatarColor || '#B5502F' }}
              >
                {article.createdBy?.name?.[0] || 'A'}
              </div>
              <span className="font-medium text-text-main">{article.createdBy?.name}</span>
            </div>

            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Published {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-sm max-w-none text-text-main font-sans space-y-4 leading-relaxed whitespace-pre-line">
          {article.body}
        </div>

        {/* Tags Footer */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-border flex items-center gap-2 text-2xs">
            <Tag className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-text-muted font-medium">Tags:</span>
            {article.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded bg-base border border-border font-mono text-text-muted">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
