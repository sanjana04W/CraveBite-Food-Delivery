"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Phone, Camera, CheckCircle2, AlertCircle, Save, RefreshCcw,
  FolderOpen, Video, X, Loader2, Circle, RotateCcw
} from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { useAdminProfile } from "../components/AdminProfileContext";
import { useTestRole, ROLES, TestRole } from "../components/TestRoleContext";

const CUISINE_SPECIALTIES = ["Italian & Pizzas", "Asian & Noodles", "Indian & Biryani", "American Burgers", "Healthy & Vegan", "Desserts & Shakes", "Mediterranean", "Mexican & Tacos", "Japanese & Sushi", "Lebanese & Wraps", "French Pastries", "Farm-to-Table"];

const ROLE_PRESETS = {
  owner: {
    firstName: "Admin",
    lastName: "Owner",
    phone: "+1 (555) 019-2834",
    title: "Restaurant Executive & Master Chef",
    address: "128 Culinary Ave, Downtown Food District",
    experience: "12 Years in Gourmet Dining & Kitchen Management",
    licenseNumber: "FSSAI-2024-EXEC-001",
    bio: "Executive manager and head chef overseeing global menu direction, quality control standards, and restaurant operations for CraveBite.",
    practiceAreas: ["Italian & Pizzas", "American Burgers", "Asian & Noodles", "Desserts & Shakes"],
  },
  kitchen: {
    firstName: "Marco",
    lastName: "Rossi",
    phone: "+1 (555) 342-8891",
    title: "Head of Kitchen & Line Prep",
    address: "Kitchen Station B, 128 Culinary Ave",
    experience: "6 Years Culinary Prep & Station Lead",
    licenseNumber: "FOOD-SAFETY-LVL3-2024",
    bio: "Lead line chef specializing in high-speed meal preparation, wok stations, recipe consistency, and food safety temperature standards.",
    practiceAreas: ["Italian & Pizzas", "Asian & Noodles", "Japanese & Sushi", "French Pastries"],
  },
  staff: {
    firstName: "Sarah",
    lastName: "Jenkins",
    phone: "+1 (555) 890-1234",
    title: "Front Desk & Operations Specialist",
    address: "Front Desk Counter, 128 Culinary Ave",
    experience: "4 Years Restaurant Operations & Customer Care",
    licenseNumber: "OPS-DISPATCH-CERT-884",
    bio: "Operations specialist managing real-time courier dispatches, table reservations, customer inquiries, and order delivery resolutions.",
    practiceAreas: ["American Burgers", "Healthy & Vegan", "Desserts & Shakes", "Mediterranean"],
  },
};

export default function AdminProfilePage() {
  const { refreshAdmin } = useAdminAuth();
  const { refreshAdminProfile } = useAdminProfile();
  const { currentRole, roleConfig, setRole } = useTestRole();

  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [errorMsg, setErrorMsg]         = useState("");

  // Photo modals
  const [photoModal, setPhotoModal]       = useState(false);   // picker menu
  const [cameraModal, setCameraModal]     = useState(false);   // live webcam
  const [uploading, setUploading]         = useState(false);
  const [camError, setCamError]           = useState("");
  const [captured, setCaptured]           = useState<string>("");  // base64 preview after capture

  // Refs
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const streamRef     = useRef<MediaStream | null>(null);

  // Profile fields
  const [firstName, setFirstName]         = useState("");
  const [lastName, setLastName]           = useState("");
  const [phone, setPhone]                 = useState("");
  const [title, setTitle]                 = useState("");
  const [address, setAddress]             = useState("");
  const [experience, setExperience]       = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [bio, setBio]                     = useState("");
  const [profilePhoto, setProfilePhoto]   = useState("");
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [ownerDbProfile, setOwnerDbProfile] = useState<any>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  // ── Load profile from DB on mount ──────────────────────────────────────────
  useEffect(() => {
    fetch("/api/admin-profile")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setOwnerDbProfile(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Sync fields whenever currentRole or ownerDbProfile changes ─────────────
  useEffect(() => {
    if (currentRole === "owner") {
      const p = ownerDbProfile || ROLE_PRESETS.owner;
      setFirstName(p.firstName || ROLE_PRESETS.owner.firstName);
      setLastName(p.lastName || ROLE_PRESETS.owner.lastName);
      setPhone(p.phone || ROLE_PRESETS.owner.phone);
      setTitle(p.title || ROLE_PRESETS.owner.title);
      setAddress(p.address || ROLE_PRESETS.owner.address);
      setExperience(p.experience || ROLE_PRESETS.owner.experience);
      setLicenseNumber(p.licenseNumber || ROLE_PRESETS.owner.licenseNumber);
      setBio(p.bio || ROLE_PRESETS.owner.bio);
      setProfilePhoto(p.profilePhoto || "");
      setPracticeAreas(p.practiceAreas && p.practiceAreas.length > 0 ? p.practiceAreas : ROLE_PRESETS.owner.practiceAreas);
    } else {
      const preset = ROLE_PRESETS[currentRole] || ROLE_PRESETS.staff;
      setFirstName(preset.firstName);
      setLastName(preset.lastName);
      setPhone(preset.phone);
      setTitle(preset.title);
      setAddress(preset.address);
      setExperience(preset.experience);
      setLicenseNumber(preset.licenseNumber);
      setBio(preset.bio);
      setProfilePhoto("");
      setPracticeAreas(preset.practiceAreas);
    }
  }, [currentRole, ownerDbProfile]);

  // ── Stop webcam stream ────────────────────────────────────────────────────
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  // ── Open webcam ───────────────────────────────────────────────────────────
  const openCamera = async () => {
    setPhotoModal(false);
    setCamError("");
    setCaptured("");
    setCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      const msg =
        err.name === "NotAllowedError"  ? "Camera access was denied. Please allow camera permissions in your browser and try again." :
        err.name === "NotFoundError"    ? "No camera detected on this device." :
        err.name === "NotReadableError" ? "Camera is already in use by another application." :
        "Could not access the camera. Please try again.";
      setCamError(msg);
    }
  };

  // ── Take snapshot ─────────────────────────────────────────────────────────
  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror the image (selfie style)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCaptured(canvas.toDataURL("image/jpeg", 0.92));
    stopStream(); // stop video preview after capture
  };

  // ── Retake photo ──────────────────────────────────────────────────────────
  const retake = () => {
    setCaptured("");
    openCamera();
  };

  // ── Use captured photo ─────────────────────────────────────────────────────
  const useCapturedPhoto = async () => {
    if (!captured) return;
    // Convert base64 to a File object
    const res = await fetch(captured);
    const blob = await res.blob();
    const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: "image/jpeg" });
    setCameraModal(false);
    stopStream();
    await uploadFile(file);
  };

  // ── Close camera modal ────────────────────────────────────────────────────
  const closeCamera = () => {
    stopStream();
    setCaptured("");
    setCamError("");
    setCameraModal(false);
  };

  // ── Upload file to API ────────────────────────────────────────────────────
  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setProfilePhoto(data.url);
        showToast("Photo uploaded! Click Save Changes to apply.");
      } else {
        setErrorMsg(data.error || "Upload failed.");
      }
    } catch {
      setErrorMsg("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelected = (file: File | null) => {
    if (!file) return;
    setPhotoModal(false);
    uploadFile(file);
  };

  const togglePractice = (area: string) => {
    setPracticeAreas(prev =>
      prev.includes(area) ? prev.filter(p => p !== area) : [...prev, area]
    );
  };

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, phone, title, address,
          experience, licenseNumber, bio, practiceAreas, profilePhoto,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshAdmin(); // update auth session name
        await refreshAdminProfile(); // update header and sidebar instantly
        showToast("Profile updated successfully.");
      } else {
        setErrorMsg(data.error || "Failed to save.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "AD";

  if (loading) return <div className="p-12 text-center text-xs text-[#667085]">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">

      {/* Hidden file input for "Choose from computer" */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFileSelected(e.target.files?.[0] ?? null)} />

      {/* Hidden canvas for webcam snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F3A] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#C8A14A]/40 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-[#C8A14A]" /><span>{successToast}</span>
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /><span>{errorMsg}</span></div>
          <button onClick={() => setErrorMsg("")} className="px-3 py-1 bg-white border border-red-200 rounded-xl font-medium hover:bg-red-100 flex items-center gap-1">
            <RefreshCcw className="w-3 h-3" /> Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
          <span>Home</span> / <span className="text-[#0B1F3A] font-medium">My Profile</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#0B1F3A]">My Profile</h1>
        <p className="text-xs text-[#667085] mt-1">Manage your restaurant operations profile, contact details, and cuisine specialties.</p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            {uploading ? (
              <div className="w-24 h-24 rounded-full bg-[#F8F9FB] border-4 border-white shadow-md flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#C8A14A] animate-spin" />
              </div>
            ) : currentRole === "owner" && profilePhoto ? (
              <img src={profilePhoto} alt={`${firstName} ${lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
            ) : (
              <div className={`w-24 h-24 rounded-full font-serif font-bold text-2xl flex items-center justify-center border-4 border-white shadow-md ${roleConfig.avatarBg}`}>
                {initials}
              </div>
            )}
            <button type="button" onClick={() => setPhotoModal(true)}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 shadow-sm transition-colors cursor-pointer" title="Change Photo">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <h2 className="text-xl font-serif font-bold text-[#0B1F3A]">{firstName} {lastName}</h2>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${roleConfig.badgeClass}`}>
                {roleConfig.badgeEmoji} {roleConfig.shortTitle}
              </span>
            </div>
            <p className="text-xs font-semibold text-stone-600">{title}</p>
            {phone && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-[#667085]">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-orange-600" />{phone}</span>
              </div>
            )}
          </div>
        </div>
        <button type="button"
          onClick={() => document.getElementById("personal-info-section")?.scrollIntoView({ behavior: "smooth" })}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer">
          Edit Profile
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6" id="personal-info-section">

        {/* Personal Information */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Personal Information</h3>
            <p className="text-xs text-[#667085]">Update your personal contact details and restaurant role information.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "First Name",         value: firstName,  set: setFirstName,  placeholder: "e.g. Marco" },
              { label: "Last Name",          value: lastName,   set: setLastName,   placeholder: "e.g. Rossi" },
              { label: "Phone Number",       value: phone,      set: setPhone,      placeholder: "+1 (555) 019-2834" },
              { label: "Professional Title", value: title,      set: setTitle,      placeholder: "e.g. Restaurant Executive / Head Chef" },
              { label: "Restaurant / HQ Address",     value: address,    set: setAddress,    placeholder: "e.g. 128 Culinary Ave, Downtown Food District" },
            ].map(f => (
              <div key={f.label} className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">{f.label}</label>
                <input type="text" value={f.value} placeholder={f.placeholder}
                  onChange={e => f.set(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-orange-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Culinary & Operations Profile</h3>
            <p className="text-xs text-[#667085]">Specify your culinary credentials, certifications, and cuisine expertise.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B1F3A]">Years in Food & Restaurant Industry</label>
              <input type="text" value={experience} placeholder="e.g. 8 Years"
                onChange={e => setExperience(e.target.value)}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-orange-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B1F3A]">Food Safety / FSSAI License Number</label>
              <input type="text" value={licenseNumber} placeholder="e.g. FSSAI-2024-CB-XXXX"
                onChange={e => setLicenseNumber(e.target.value)}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-orange-500" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B1F3A]">Cuisine Specialties</label>
            <p className="text-[10px] text-[#667085]">Select all cuisines your kitchen specializes in</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {CUISINE_SPECIALTIES.map(area => {
                const sel = practiceAreas.includes(area);
                return (
                  <button key={area} type="button" onClick={() => togglePractice(area)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left flex items-center justify-between ${
                      sel ? "border-orange-500 bg-orange-50 text-orange-800" : "border-[#E5E7EB] bg-[#F8F9FB] text-[#667085] hover:bg-slate-100"
                    }`}>
                    <span>{area}</span>
                    {sel && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B1F3A]">Chef / Manager Bio</label>
            <textarea rows={4} value={bio} placeholder="Briefly describe your culinary philosophy, background, signature dishes, and what drives your passion for food..."
              onChange={e => setBio(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-3.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-orange-500 resize-none" />
          </div>
        </div>

        {/* Public Preview */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Public Profile Preview</h3>
            <p className="text-xs text-[#667085]">How your chef profile appears to customers on the About page.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {currentRole === "owner" && profilePhoto ? (
              <img src={profilePhoto} alt="Preview" className="w-16 h-16 rounded-full object-cover shrink-0" />
            ) : (
              <div className={`w-16 h-16 rounded-full font-serif font-bold text-xl flex items-center justify-center shrink-0 ${roleConfig.avatarBg}`}>{initials}</div>
            )}
            <div className="space-y-1 flex-1">
              <h4 className="font-serif font-bold text-sm text-[#0B1F3A]">{firstName} {lastName}{title ? `, ${title}` : ""}</h4>
              <p className="text-xs text-[#667085] line-clamp-2">{bio || "No bio added yet."}</p>
              <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
                {practiceAreas.map(p => (
                  <span key={p} className="text-[9px] px-2 py-0.5 rounded bg-white border border-[#E5E7EB] font-medium text-[#0B1F3A]">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => window.location.reload()}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 transition-colors cursor-pointer">
            Discard Changes
          </button>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer">
            <Save className="w-3.5 h-3.5" />{saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      {/* ══ PHOTO PICKER MODAL ═══════════════════════════════════════════════ */}
      {photoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPhotoModal(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-5"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Change Profile Photo</h3>
                <p className="text-[11px] text-[#667085] mt-0.5">JPG, PNG or WEBP · Max 5MB</p>
              </div>
              <button onClick={() => setPhotoModal(false)} className="p-1.5 rounded-xl text-[#667085] hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>

            {/* Current photo preview */}
            <div className="flex justify-center">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Current" className="w-20 h-20 rounded-full object-cover border-4 border-[#E5E7EB] shadow-sm" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#0B1F3A] text-[#C8A14A] font-serif font-bold text-2xl flex items-center justify-center border-4 border-[#E5E7EB] shadow-sm">{initials}</div>
              )}
            </div>

            <div className="space-y-3">
              {/* Choose from computer */}
              <button type="button"
                onClick={() => { setPhotoModal(false); setTimeout(() => fileInputRef.current?.click(), 50); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-[#E5E7EB] hover:border-[#C8A14A] hover:bg-[#C8A14A]/5 transition-all group text-left">
                <div className="w-10 h-10 rounded-xl bg-[#0B1F3A]/5 group-hover:bg-[#C8A14A]/10 flex items-center justify-center shrink-0 transition-colors">
                  <FolderOpen className="w-5 h-5 text-[#0B1F3A] group-hover:text-[#C8A14A] transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0B1F3A]">Choose from My Computer</p>
                  <p className="text-[10px] text-[#667085] mt-0.5">Browse and select a photo from your device</p>
                </div>
              </button>

              {/* Take a photo via webcam */}
              <button type="button" onClick={openCamera}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-[#E5E7EB] hover:border-[#C8A14A] hover:bg-[#C8A14A]/5 transition-all group text-left">
                <div className="w-10 h-10 rounded-xl bg-[#0B1F3A]/5 group-hover:bg-[#C8A14A]/10 flex items-center justify-center shrink-0 transition-colors">
                  <Video className="w-5 h-5 text-[#0B1F3A] group-hover:text-[#C8A14A] transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0B1F3A]">Take a Photo with Webcam</p>
                  <p className="text-[10px] text-[#667085] mt-0.5">Open your webcam and snap a photo live</p>
                </div>
              </button>

              {/* Remove */}
              {profilePhoto && (
                <button type="button"
                  onClick={() => { setProfilePhoto(""); setPhotoModal(false); showToast("Photo removed. Click Save Changes to apply."); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-red-100 hover:border-red-300 hover:bg-red-50 transition-all group text-left">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-600">Remove Current Photo</p>
                    <p className="text-[10px] text-[#667085] mt-0.5">Go back to initials display</p>
                  </div>
                </button>
              )}
            </div>

            <p className="text-[10px] text-center text-[#667085]">
              After choosing a photo, click <strong>Save Changes</strong> to apply permanently.
            </p>
          </div>
        </div>
      )}

      {/* ══ LIVE WEBCAM MODAL ════════════════════════════════════════════════ */}
      {cameraModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0B1F3A] rounded-2xl max-w-lg w-full shadow-2xl border border-white/10 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#C8A14A]" />
                <span className="text-sm font-bold text-white">Take a Photo</span>
              </div>
              <button onClick={closeCamera} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Camera body */}
            <div className="p-5 space-y-4">

              {/* Error state */}
              {camError ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Camera Unavailable</p>
                    <p className="text-xs text-white/60 mt-1 max-w-xs">{camError}</p>
                  </div>
                  <button onClick={closeCamera}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors">
                    Close
                  </button>
                </div>
              ) : captured ? (
                /* ── Captured preview ── */
                <div className="space-y-4">
                  <p className="text-xs text-white/60 text-center">Preview your photo</p>
                  <div className="rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center">
                    <img src={captured} alt="Captured" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={retake}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/20 text-white text-xs font-medium hover:bg-white/10 transition-colors">
                      <RotateCcw className="w-4 h-4" /> Retake
                    </button>
                    <button onClick={useCapturedPhoto}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] text-xs font-bold transition-colors">
                      <CheckCircle2 className="w-4 h-4" /> Use This Photo
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Live video feed ── */
                <div className="space-y-4">
                  <p className="text-xs text-white/60 text-center">Position yourself in frame, then click Capture</p>
                  <div className="rounded-xl overflow-hidden aspect-video bg-black relative">
                    <video ref={videoRef} autoPlay playsInline muted
                      className="w-full h-full object-cover"
                      style={{ transform: "scaleX(-1)" }} /* mirror for selfie feel */
                    />
                    {/* Crosshair guide */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-28 h-28 rounded-full border-2 border-white/30" />
                    </div>
                  </div>
                  <button onClick={takeSnapshot}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-sm transition-colors">
                    <Circle className="w-5 h-5" /> Capture Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload spinner overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl flex items-center gap-4 border border-[#E5E7EB]">
            <Loader2 className="w-6 h-6 text-[#C8A14A] animate-spin" />
            <div>
              <p className="text-sm font-bold text-[#0B1F3A]">Uploading photo...</p>
              <p className="text-xs text-[#667085]">Please wait a moment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}