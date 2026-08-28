"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Upload, Check, ImageIcon } from "lucide-react";

export default function AddPracticeAreaPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Basic fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [shortDescription, setShortDescription] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [overviewDescription, setOverviewDescription] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroPreview, setHeroPreview] = useState("");
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const [order, setOrder] = useState(1);

  // Dynamic lists
  const [services, setServices] = useState([
    { icon: "Scale", title: "", description: "" },
  ]);
  const [matters, setMatters] = useState([""]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  // Browse Files — open file picker and show preview
  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setHeroPreview(objectUrl);
    // For simplicity store the object URL — in production you would upload to Cloudinary/S3
    setHeroImageUrl(objectUrl);
  };

  // Update image from URL field
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeroImageUrl(e.target.value);
    setHeroPreview(e.target.value);
  };

  // Submit handler
  const handleSubmit = useCallback(async (submitStatus: "Published" | "Draft") => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) { setErrorMsg("Practice area name is required."); return; }
    if (!slug.trim()) { setErrorMsg("URL slug is required."); return; }
    if (!shortDescription.trim()) { setErrorMsg("Short description is required."); return; }

    setSubmitting(true);
    try {
      const payload = {
        slug,
        title: name,
        category,
        iconName: "Scale",
        description: shortDescription,
        subtitle,
        overviewDescription,
        heroImage: heroImageUrl,
        services: services.filter((s) => s.title.trim()),
        commonMatters: matters.filter((m) => m.trim()),
        faqs: faqs.filter((f) => f.question.trim()),
        status: submitStatus,
        visibility: true,
        order,
      };

      const res = await fetch("/api/practice-areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");

      setSuccessMsg(`Practice area "${name}" ${submitStatus === "Published" ? "published" : "saved as draft"} successfully!`);
      setTimeout(() => router.push("/admin/practice-areas"), 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }, [name, slug, category, shortDescription, subtitle, overviewDescription, heroImageUrl, services, matters, faqs, order, router]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/practice-areas"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#667085] hover:text-[#0B1F3A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Practice Areas
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit("Draft")}
            disabled={submitting}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Save as Draft"}
          </button>
          <button
            onClick={() => handleSubmit("Published")}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] text-xs font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Publishing..." : "Publish Practice Area"}
          </button>
        </div>
      </div>

      {/* Success / Error banners */}
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

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-8">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0B1F3A]">Add New Practice Area</h1>
          <p className="text-xs text-[#667085] mt-1">Configure the details for your public legal service offering.</p>
        </div>

        <hr className="border-[#E5E7EB]" />

        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Practice Area Name *</label>
              <input
                type="text"
                placeholder="e.g. Property Law"
                value={name}
                onChange={handleNameChange}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">URL Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="property-law"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
              />
              <span className="text-[10px] text-[#667085] mt-1 block">
                Public URL: /practice-areas/{slug || "property-law"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Category Badge</label>
            <input
              type="text"
              placeholder="e.g. REAL ESTATE, FAMILY, BUSINESS"
              value={category}
              onChange={(e) => setCategory(e.target.value.toUpperCase())}
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Short Description (Card Text) *</label>
            <textarea
              rows={3}
              placeholder="Legal advice and representation for land, property ownership, transfers, and disputes."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-4 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
            />
            <span className="text-[10px] text-[#667085] mt-1 block">Shown on the practice areas cards page. Recommended: 150–200 characters.</span>
          </div>
        </div>

        <hr className="border-[#E5E7EB]" />

        {/* Section 2: Detail Page Content */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Detail Page Content</h3>

          <div>
            <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Subtitle (Detail Page Hero)</label>
            <input
              type="text"
              placeholder="Professional legal guidance for property transactions..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Overview Description</label>
            <textarea
              rows={4}
              placeholder="Provide comprehensive professional legal guidance for individuals and businesses..."
              value={overviewDescription}
              onChange={(e) => setOverviewDescription(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-4 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
            />
          </div>

          {/* Services */}
          <div>
            <label className="block text-xs font-medium text-[#0B1F3A] mb-2">Services We Provide</label>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
                  <input
                    type="text"
                    placeholder="Service title"
                    value={service.title}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[index] = { ...updated[index], title: e.target.value };
                      setServices(updated);
                    }}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2 text-xs text-[#0B1F3A]"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Short description"
                      value={service.description}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[index] = { ...updated[index], description: e.target.value };
                        setServices(updated);
                      }}
                      className="flex-1 bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2 text-xs text-[#0B1F3A]"
                    />
                    <button
                      onClick={() => setServices(services.filter((_, i) => i !== index))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setServices([...services, { icon: "Scale", title: "", description: "" }])}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A14A] mt-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Service
              </button>
            </div>
          </div>

          {/* Common Matters */}
          <div>
            <label className="block text-xs font-medium text-[#0B1F3A] mb-2">Common Legal Matters</label>
            <div className="space-y-2">
              {matters.map((matter, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Property ownership disputes"
                    value={matter}
                    onChange={(e) => {
                      const updated = [...matters];
                      updated[index] = e.target.value;
                      setMatters(updated);
                    }}
                    className="flex-1 bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2 text-xs text-[#0B1F3A]"
                  />
                  <button
                    onClick={() => setMatters(matters.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setMatters([...matters, ""])}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A14A] mt-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Matter
              </button>
            </div>
          </div>

          {/* FAQs */}
          <div>
            <label className="block text-xs font-medium text-[#0B1F3A] mb-2">Frequently Asked Questions</label>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-[#F8F9FB] rounded-xl p-4 space-y-2 border border-[#E5E7EB]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[index] = { ...updated[index], question: e.target.value };
                        setFaqs(updated);
                      }}
                      className="flex-1 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#0B1F3A]"
                    />
                    <button
                      onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[index] = { ...updated[index], answer: e.target.value };
                      setFaqs(updated);
                    }}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#0B1F3A]"
                  />
                </div>
              ))}
              <button
                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A14A] mt-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            </div>
          </div>
        </div>

        <hr className="border-[#E5E7EB]" />

        {/* Section 3: Practice Area Images */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Practice Area Images</h3>

          {/* URL Input */}
          <div>
            <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Hero Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={heroImageUrl}
              onChange={handleUrlChange}
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
            />
            <span className="text-[10px] text-[#667085] mt-1 block">Paste a URL or use Browse Files below.</span>
          </div>

          {/* File upload / preview */}
          <div
            className="border-2 border-dashed border-[#E5E7EB] rounded-2xl p-8 text-center bg-[#F8F9FB] cursor-pointer hover:border-[#C8A14A] transition-colors"
            onClick={handleBrowseClick}
          >
            {heroPreview ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroPreview}
                  alt="Hero preview"
                  className="w-full max-h-52 object-cover rounded-xl"
                  onError={() => setHeroPreview("")}
                />
                <p className="text-[10px] text-[#667085]">Click to change image</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#667085] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#0B1F3A]">Upload Main Hero Image</p>
                <p className="text-[10px] text-[#667085] mt-1">Recommended image ratio: 16:9 (PNG, JPG)</p>
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

        <hr className="border-[#E5E7EB]" />

        {/* Section 4: Publication Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Publication Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A]"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Display Order Number</label>
              <input
                type="number"
                value={order}
                min={1}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E5E7EB]">
          <Link
            href="/admin/practice-areas"
            className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={() => handleSubmit("Draft")}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit("Published")}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish Practice Area"}
          </button>
        </div>
      </div>
    </div>
  );
}