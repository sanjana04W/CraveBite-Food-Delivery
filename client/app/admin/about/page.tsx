"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  User, Camera, Save, Check, Upload, RefreshCw, Eye,
  Mail, Phone, Briefcase, FileText, Tag
} from "lucide-react";
import Link from "next/link";

export default function AdminAboutUsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState<number>(15);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpec, setNewSpec] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lawyer-profile");
      const data = await res.json();
      if (data.success && data.data) {
        const p = data.data;
        setName(p.name || "");
        setTitle(p.title || "");
        setPhoto(p.photo || "");
        setPhotoPreview(p.photo || "");
        setBio(p.bio || "");
        setYearsExperience(p.yearsExperience || 15);
        setEmail(p.email || "");
        setPhone(p.phone || "");
        setSpecializations(p.specializations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleBrowseClick = () => fileInputRef.current?.click();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediate preview
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setPhoto(data.url);
        setPhotoPreview(data.url);
      } else {
        // Fallback to base64 data URL if file upload endpoint returns error
        const reader = new FileReader();
        reader.onload = (re) => {
          const base64 = re.target?.result as string;
          setPhoto(base64);
          setPhotoPreview(base64);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Fallback to base64 data URL
      const reader = new FileReader();
      reader.onload = (re) => {
        const base64 = re.target?.result as string;
        setPhoto(base64);
        setPhotoPreview(base64);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addSpecialization = () => {
    const trimmed = newSpec.trim();
    if (trimmed && !specializations.includes(trimmed)) {
      setSpecializations([...specializations, trimmed]);
      setNewSpec("");
    }
  };
  const removeSpecialization = (s: string) => setSpecializations(specializations.filter((x) => x !== s));

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!name.trim()) { setErrorMsg("Name is required."); return; }
    if (!bio.trim()) { setErrorMsg("Biography is required."); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/lawyer-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, title, photo, bio, yearsExperience, email, phone, specializations }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSuccessMsg("Profile updated successfully! The About page will now reflect these changes.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm text-[#667085]">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0B1F3A]">About Us — Lawyer Profile</h1>
          <p className="text-xs text-[#667085] mt-1">
            Edit your name, photo, biography and details shown on the public About page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#667085] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </Link>
          <button
            onClick={fetchProfile}
            className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-[#667085] hover:bg-slate-50 transition-colors shadow-sm"
            title="Reload from DB"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-xs shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT — Photo + Preview Card */}
        <div className="space-y-6">

          {/* Photo Upload */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#C8A14A]" /> Profile Photo
            </h3>

            {/* Photo Preview */}
            <div className="relative">
              {photoPreview ? (
                <div className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-56 object-cover object-top rounded-xl border border-[#E5E7EB]"
                    onError={() => setPhotoPreview("")}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <button onClick={handleBrowseClick} className="text-white text-xs font-bold">Change Photo</button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={handleBrowseClick}
                  className="w-full h-56 rounded-xl border-2 border-dashed border-[#E5E7EB] bg-[#F8F9FB] flex flex-col items-center justify-center cursor-pointer hover:border-[#C8A14A] transition-colors"
                >
                  <Upload className="w-8 h-8 text-[#667085] mb-2" />
                  <p className="text-xs font-medium text-[#0B1F3A]">Upload Photo</p>
                  <p className="text-[10px] text-[#667085]">PNG, JPG or WebP</p>
                </div>
              )}
            </div>

            {/* URL input */}
            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1">Photo URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={photo}
                onChange={(e) => { setPhoto(e.target.value); setPhotoPreview(e.target.value); }}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
              />
              <p className="text-[10px] text-[#667085] mt-1">Paste URL or use Browse Files</p>
            </div>

            <button
              onClick={handleBrowseClick}
              className="w-full py-2.5 bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl text-xs font-medium text-[#0B1F3A] hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Browse Files
            </button>
          </div>

          {/* Live Preview Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">Preview Badge</h3>
            <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title || "SENIOR PARTNER"}</span>
              <span className="text-sm font-serif font-bold text-[#0B1F3A]">{name || "Lawyer Name"}</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Profile Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#C8A14A]" /> Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. James R. Montgomery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Title / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Partner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Years Experience</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="lawyer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C8A14A]" /> Biography
            </h3>
            <div>
              <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">
                Professional Biography *
              </label>
              <textarea
                rows={6}
                placeholder="Write a professional biography that appears on the About page..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-4 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A] leading-relaxed"
              />
              <p className="text-[10px] text-[#667085] mt-1">
                This text appears in the "Meet Your Legal Advisor" section on the public About page.
              </p>
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#C8A14A]" /> Specializations
            </h3>
            <div className="flex flex-wrap gap-2">
              {specializations.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C8A14A]/10 border border-[#C8A14A]/30 text-[#0B1F3A] rounded-full text-xs font-semibold"
                >
                  {s}
                  <button
                    onClick={() => removeSpecialization(s)}
                    className="text-[#667085] hover:text-red-600 transition-colors font-bold text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add specialization (e.g. Property Law)"
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpecialization(); } }}
                className="flex-1 bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-4 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
              />
              <button
                onClick={addSpecialization}
                className="px-4 py-2 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold hover:bg-[#162d4f] transition-colors"
              >
                + Add
              </button>
            </div>
            <p className="text-[10px] text-[#667085]">Press Enter or click Add to add a specialization.</p>
          </div>

          {/* Save Button (bottom) */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-sm shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
