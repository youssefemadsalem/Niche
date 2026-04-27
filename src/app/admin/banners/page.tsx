"use client";

import { useState, useEffect } from "react";

interface Banner {
  _id: string;
  title: string;
  image: string;
  link?: string;
  isActive: boolean;
  position: string;
}

const positions = ["home_top", "home_middle", "home_bottom", "sidebar"];

const emptyForm = {
  title: "",
  image: "",
  link: "",
  isActive: true,
  position: "home_top" as Banner["position"],
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/banners");
    const data = await res.json();
    setBanners(data.banners);
    setLoading(false);
  };

  const showFeedback = (message: string, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback({ message: "", isError: false }), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editingId
      ? `/api/admin/banners/${editingId}`
      : "/api/admin/banners";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return showFeedback(data.error, true);
    showFeedback(editingId ? "Banner updated" : "Banner created");
    setForm(emptyForm);
    setEditingId(null);
    fetchBanners();
  };

  const handleEdit = (banner: Banner) => {
    setEditingId(banner._id);
    setForm({
      title: banner.title,
      image: banner.image,
      link: banner.link ?? "",
      isActive: banner.isActive,
      position: banner.position as typeof emptyForm.position,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    if (!res.ok) return showFeedback("Failed to delete banner", true);
    showFeedback("Banner deleted");
    fetchBanners();
  };

  const inputStyle = {
    backgroundColor: "white",
    border: "1.5px solid #e5e7eb",
    fontFamily: "var(--font-body)",
  };

  return (
    <div>
      <h1
        className="text-4xl font-bold mb-2"
        style={{ fontFamily: "var(--font-headline)" }}
      >
        Banner Management
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
        Manage homepage banners and content
      </p>

      {feedback.message && (
        <div
          className="mb-6 p-4 rounded-xl text-sm"
          style={{
            backgroundColor: feedback.isError ? "#fee2e2" : "#d1fae5",
            color: feedback.isError ? "#991b1b" : "#065f46",
          }}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: "white", border: "1.5px solid #e5e7eb" }}
        >
          <h2
            className="text-lg font-bold mb-6"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            {editingId ? "Edit Banner" : "Add New Banner"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Banner title"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Link (optional)
              </label>
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <select
                value={form.position}
                onChange={(e) =>
                  setForm({
                    ...form,
                    position: e.target.value as typeof emptyForm.position,
                  })
                }
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              >
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className="w-10 h-6 rounded-full transition-all relative"
                style={{
                  backgroundColor: form.isActive
                    ? "var(--color-secondary)"
                    : "#e5e7eb",
                }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                  style={{ left: form.isActive ? "18px" : "2px" }}
                />
              </button>
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  opacity: saving ? 0.7 : 1,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-secondary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-primary)")
                }
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: "white",
                    border: "1.5px solid #e5e7eb",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Banners list */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--color-secondary)" }}
              />
            </div>
          ) : banners.length === 0 ? (
            <div
              className="p-8 rounded-2xl text-center"
              style={{
                backgroundColor: "white",
                border: "1.5px solid #e5e7eb",
              }}
            >
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                No banners yet. Create one!
              </p>
            </div>
          ) : (
            banners.map((banner) => (
              <div
                key={banner._id}
                className="p-5 rounded-2xl flex items-center gap-4"
                style={{
                  backgroundColor: "white",
                  border: "1.5px solid #e5e7eb",
                }}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-20 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {banner.title}
                  </p>
                  <p
                    className="text-xs mt-0.5 capitalize"
                    style={{ color: "#9ca3af" }}
                  >
                    {banner.position.replace("_", " ")}
                  </p>
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: banner.isActive ? "#d1fae5" : "#fee2e2",
                      color: banner.isActive ? "#065f46" : "#991b1b",
                    }}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ backgroundColor: "var(--color-tertiary)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-secondary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-tertiary)")
                    }
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ backgroundColor: "#fee2e2" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fecaca")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fee2e2")
                    }
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#991b1b"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
