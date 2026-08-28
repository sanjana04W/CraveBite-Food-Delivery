"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText, Globe, File, Star, Search, Plus,
  RefreshCw, Edit, Trash2, Eye, CheckCircle2, Clock, Archive
} from "lucide-react";

interface Article {
  _id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: "Published" | "Draft" | "Archived";
  featured: boolean;
  views: number;
  heroImage: string;
  updatedAt: string;
}

export default function LegalArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/articles?all=true");
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch (e) {
      console.error("Failed to fetch articles", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All Status" || a.status === statusFilter;
    const matchCat = categoryFilter === "All Categories" || a.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const handleDeleteClick = (article: Article) => {
    setSelectedArticle(article);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${selectedArticle.slug}`, { method: "DELETE" });
      if (res.ok) setArticles((prev) => prev.filter((a) => a.slug !== selectedArticle.slug));
    } catch (e) {
      console.error("Delete failed", e);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setSelectedArticle(null);
    }
  };

  const published = articles.filter((a) => a.status === "Published").length;
  const drafts = articles.filter((a) => a.status === "Draft").length;
  const featuredCount = articles.filter((a) => a.featured).length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0B1F3A]">Legal Articles</h1>
          <p className="text-xs text-[#667085] mt-1">
            Create, manage, and publish professional legal articles and insights on the public website.
          </p>
        </div>
        <Link
          href="/admin/articles/add"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Article
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#667085]">Total Articles</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{articles.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#0B1F3A]" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#667085]">Published</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{published}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#667085]">Drafts</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{drafts}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <File className="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#667085]">Total Views</p>
            <h3 className="text-2xl font-bold text-[#C8A14A] mt-1">{totalViews.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#C8A14A]/10 flex items-center justify-center">
            <Eye className="w-5 h-5 text-[#C8A14A]" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2 text-xs text-[#0B1F3A] placeholder-[#667085] focus:outline-none focus:border-[#C8A14A]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
          >
            <option>All Categories</option>
            <option>Property Law</option>
            <option>Family Law</option>
            <option>Civil Law</option>
            <option>Criminal Law</option>
            <option>Labour Law</option>
            <option>Corporate Law</option>
          </select>
          <button
            onClick={() => { setSearchQuery(""); setStatusFilter("All Status"); setCategoryFilter("All Categories"); fetchArticles(); }}
            className="p-2 rounded-xl bg-[#F8F9FB] hover:bg-slate-100 text-[#667085] border border-[#E5E7EB]"
            title="Reset & Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-[#0B1F3A]">All Articles ({filtered.length})</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#667085]">Loading articles...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#667085]">
            No articles found.{" "}
            <Link href="/admin/articles/add" className="text-[#C8A14A] font-bold hover:underline">
              Create your first one
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] border-b border-[#E5E7EB] text-[10px] font-bold text-[#667085] uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs text-[#0B1F3A]">
                {filtered.map((article) => (
                  <tr key={article._id} className="hover:bg-[#F8F9FB]/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3 max-w-xs">
                        {article.heroImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={article.heroImage}
                            alt={article.title}
                            className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-[#F8F9FB] border border-slate-200 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-[#667085]" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#0B1F3A] line-clamp-1">{article.title}</p>
                          {article.featured && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#C8A14A] font-semibold">
                              <Star className="w-3 h-3 fill-[#C8A14A]" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-full bg-[#0B1F3A]/5 text-[10px] font-semibold text-[#0B1F3A]">
                        {article.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#667085]">{article.author}</td>
                    <td className="py-4 px-4">
                      {article.status === "Published" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Published
                        </span>
                      )}
                      {article.status === "Draft" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      )}
                      {article.status === "Archived" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <Archive className="w-3 h-3" /> Archived
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[#667085]">{(article.views || 0).toLocaleString()}</td>
                    <td className="py-4 px-4 text-[#667085]">{article.date}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-[#F8F9FB] hover:bg-slate-100 text-[#667085]"
                          title="View on site"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/articles/add?edit=${article.slug}`}
                          className="p-1.5 rounded-lg bg-[#F8F9FB] hover:bg-slate-100 text-[#667085]"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(article)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB]">
            <h3 className="text-lg font-serif font-bold text-[#0B1F3A]">Delete Article?</h3>
            <p className="text-xs text-[#667085] mt-2">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#0B1F3A]">&ldquo;{selectedArticle.title}&rdquo;</span>?
              This will remove it from the public website permanently.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => { setDeleteModalOpen(false); setSelectedArticle(null); }}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Article"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}