"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Plus, Trash2, Upload, Check, FileText,
  Bold, Italic, List, AlignLeft, Link as LinkIcon, Image as ImageIcon
} from "lucide-react";

export default function CreateArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Property Law");
  const [author, setAuthor] = useState("Attorney-at-Law");
  const [readingTime, setReadingTime] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [summary, setSummary] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroPreview, setHeroPreview] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"Published" | "Draft">("Published");

  // Content sections
  const [sections, setSections] = useState([{ heading: "", paragraphs: [""] }]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Load for edit mode
  useEffect(() => {
    if (!editSlug) return;
    setIsEditMode(true);
    fetch(`/api/articles/${editSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return;
        const a = data.data;
        setTitle(a.title || "");
        setSlug(a.slug || "");
        setCategory(a.category || "Property Law");
        setAuthor(a.author || "Attorney-at-Law");
        setReadingTime(a.readingTime || "");
        setExcerpt(a.excerpt || "");
        setSummary(a.summary || "");
        setHeroImageUrl(a.heroImage || "");
        setHeroPreview(a.heroImage || "");
        setFeatured(a.featured || false);
        setStatus(a.status || "Published");
        if (a.content && a.content.length > 0) setSections(a.content);
      })
      .catch(console.error);
  }, [editSlug]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditMode) {
      setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  };

  // Browse Files
  const handleBrowseClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setHeroPreview(objectUrl);
    setHeroImageUrl(objectUrl);
  };

  // Section management
  const addSection = () => setSections([...sections, { heading: "", paragraphs: [""] }]);
  const removeSection = (i: number) => setSections(sections.filter((_, idx) => idx !== i));
  const updateSectionHeading = (i: number, val: string) => {
    const updated = [...sections];
    updated[i] = { ...updated[i], heading: val };
    setSections(updated);
  };
  const addParagraph = (i: number) => {
    const updated = [...sections];
    updated[i] = { ...updated[i], paragraphs: [...updated[i].paragraphs, ""] };
    setSections(updated);
  };
  const updateParagraph = (si: number, pi: number, val: string) => {
    const updated = [...sections];
    updated[si].paragraphs[pi] = val;
    setSections(updated);
  };
  const removeParagraph = (si: number, pi: number) => {
    const updated = [...sections];
    updated[si].paragraphs = updated[si].paragraphs.filter((_, idx) => idx !== pi);
    setSections(updated);
  };

  const handleSubmit = useCallback(async (submitStatus: "Published" | "Draft") => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim()) { setErrorMsg("Article title is required."); return; }
    if (!slug.trim()) { setErrorMsg("URL slug is required."); return; }
    if (!excerpt.trim()) { setErrorMsg("Short summary is required."); return; }

    setSubmitting(true);
    try {
      const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      const payload = {
        slug,
        title,
        category,
        author,
        date: today,
        readingTime: readingTime || "5 min read",
        excerpt,
        summary: summary || excerpt,
        heroImage: heroImageUrl,
        content: sections.filter((s) => s.heading.trim()),
        featured,
        status: submitStatus,
      };

      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode ? `/api/articles/${editSlug}` : "/api/articles";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");

      setSuccessMsg(`Article "${title}" ${submitStatus === "Published" ? "published" : "saved as draft"} successfully!`);
      setTimeout(() => router.push("/admin/articles"), 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }, [title, slug, category, author, readingTime, excerpt, summary, heroImageUrl, sections, featured, isEditMode, editSlug, router]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#667085] hover:text-[#0B1F3A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Legal Articles
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit("Draft")}
            disabled={submitting}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save as Draft"}
          </button>
          <button
            onClick={() => handleSubmit("Published")}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? "Publishing..." : isEditMode ? "Update Article" : "Publish Article"}
          </button>
        </div>
      </div>

      {/* Banners */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-xs font-medium">
          <Check className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-serif font-bold text-[#0B1F3A]">
          {isEditMode ? "Edit Article" : "Create New Article"}
        </h1>
        <p className="text-xs text-[#667085] mt-1">Create and publish a professional legal article for your website visitors.</p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Editor - Span 2) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Article Title *</label>
              <input
                type="text"
                placeholder="Enter article title..."
                value={title}
                onChange={handleTitleChange}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">URL Slug *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="understanding-property-rights"
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
                <span className="text-[10px] text-[#667085] mt-1 block">
                  Public URL: /articles/{slug || "your-article"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                >
                  <option>Property Law</option>
                  <option>Family Law</option>
                  <option>Civil Law</option>
                  <option>Criminal Law</option>
                  <option>Labour Law</option>
                  <option>Corporate Law</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Author</label>
                <input
                  type="text"
                  placeholder="Attorney-at-Law"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Reading Time</label>
                <input
                  type="text"
                  placeholder="e.g. 8 min read"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Short Summary (Card Excerpt) *</label>
              <textarea
                rows={3}
                placeholder="Brief description shown on the articles listing cards..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-4 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
              />
              <span className="text-[10px] text-[#667085] mt-1 block">Appears on public article cards. Recommended: 150–200 characters.</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Article Summary (Detail Page)</label>
              <textarea
                rows={3}
                placeholder="Longer introductory quote shown at the top of the article detail page..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-4 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Article Cover Image</h3>
            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={heroImageUrl}
                onChange={(e) => { setHeroImageUrl(e.target.value); setHeroPreview(e.target.value); }}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
              />
              <span className="text-[10px] text-[#667085] mt-1 block">Paste a URL or use Browse Files below.</span>
            </div>
            <div
              className="border-2 border-dashed border-[#E5E7EB] rounded-2xl p-8 text-center bg-[#F8F9FB] cursor-pointer hover:border-[#C8A14A] transition-colors"
              onClick={handleBrowseClick}
            >
              {heroPreview ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroPreview} alt="Preview" className="w-full max-h-52 object-cover rounded-xl" onError={() => setHeroPreview("")} />
                  <p className="text-[10px] text-[#667085]">Click to change image</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-[#667085] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#0B1F3A]">Upload Cover Image</p>
                  <p className="text-[10px] text-[#667085] mt-1">Recommended size: 1200 × 675 px (Ratio 16:9)</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
                    className="mt-4 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-medium text-[#0B1F3A] shadow-sm hover:bg-slate-50"
                  >
                    Browse Files
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Article Content — Structured Sections */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Article Content</h3>
              <span className="text-[10px] text-[#667085]">Add sections with headings and paragraphs</span>
            </div>

            {/* Toolbar (visual, matches original design) */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl text-[#667085]">
              {[Bold, Italic, List, AlignLeft, LinkIcon, ImageIcon].map((Icon, i) => (
                <button key={i} type="button" className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {sections.map((section, si) => (
              <div key={si} className="border border-[#E5E7EB] rounded-2xl p-4 space-y-3 bg-[#F8F9FB]">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder={`Section ${si + 1} heading...`}
                    value={section.heading}
                    onChange={(e) => updateSectionHeading(si, e.target.value)}
                    className="flex-1 bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-bold text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  />
                  {sections.length > 1 && (
                    <button onClick={() => removeSection(si)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {section.paragraphs.map((p, pi) => (
                  <div key={pi} className="flex gap-2">
                    <textarea
                      rows={3}
                      placeholder={`Paragraph ${pi + 1}...`}
                      value={p}
                      onChange={(e) => updateParagraph(si, pi, e.target.value)}
                      className="flex-1 bg-white border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                    />
                    {section.paragraphs.length > 1 && (
                      <button onClick={() => removeParagraph(si, pi)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg self-start mt-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addParagraph(si)}
                  className="text-xs text-[#C8A14A] font-bold hover:underline"
                >
                  + Add Paragraph
                </button>
              </div>
            ))}

            <button
              onClick={addSection}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A14A] hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Section
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* Publishing */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Publishing</h3>
            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2 text-xs text-[#0B1F3A]"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleSubmit("Draft")}
                disabled={submitting}
                className="flex-1 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit("Published")}
                disabled={submitting}
                className="flex-1 py-2 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] text-xs font-bold disabled:opacity-50"
              >
                {isEditMode ? "Update" : "Publish"}
              </button>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Featured Article</h3>
              <input
                type="checkbox"
                checked={featured}
                onChange={() => setFeatured(!featured)}
                className="w-4 h-4 accent-[#C8A14A] cursor-pointer"
              />
            </div>
            <p className="text-[10px] text-[#667085]">
              Featured articles appear prominently in the horizontal card at the top of the Legal Articles page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}