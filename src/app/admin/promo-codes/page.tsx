"use client";

import { useState, useEffect } from "react";

interface PromoCode {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiryDate?: string;
  isActive: boolean;
}

const emptyForm = {
  code: "",
  discountType: "percentage" as "percentage" | "fixed",
  discountValue: 0,
  minOrderAmount: "",
  maxUses: "",
  expiryDate: "",
  isActive: true,
};

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/promo-codes");
    const data = await res.json();
    setPromoCodes(data.promoCodes);
    setLoading(false);
  };

  const showFeedback = (message: string, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback({ message: "", isError: false }), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editingId
      ? `/api/admin/promo-codes/${editingId}`
      : "/api/admin/promo-codes";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: form.minOrderAmount
          ? Number(form.minOrderAmount)
          : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiryDate: form.expiryDate
          ? new Date(form.expiryDate).toISOString()
          : undefined,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return showFeedback(data.error, true);
    showFeedback(editingId ? "Promo code updated" : "Promo code created");
    setForm(emptyForm);
    setEditingId(null);
    fetchPromoCodes();
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingId(promo._id);
    setForm({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minOrderAmount: promo.minOrderAmount?.toString() ?? "",
      maxUses: promo.maxUses?.toString() ?? "",
      expiryDate: promo.expiryDate
        ? new Date(promo.expiryDate).toISOString().split("T")[0]
        : "",
      isActive: promo.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    const res = await fetch(`/api/admin/promo-codes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return showFeedback("Failed to delete promo code", true);
    showFeedback("Promo code deleted");
    fetchPromoCodes();
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
        Promo Codes
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
        Create and manage discount codes
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
            {editingId ? "Edit Promo Code" : "Add New Promo Code"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g. SAVE20"
                disabled={!!editingId}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ ...inputStyle, opacity: editingId ? 0.6 : 1 }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Discount type toggle */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Discount Type
              </label>
              <div
                className="flex rounded-xl p-1 gap-1"
                style={{
                  backgroundColor: "var(--color-neutral)",
                  border: "1.5px solid #e5e7eb",
                }}
              >
                {(["percentage", "fixed"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setForm({ ...form, discountType: type })}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                    style={{
                      backgroundColor:
                        form.discountType === type
                          ? "var(--color-primary)"
                          : "transparent",
                      color: form.discountType === type ? "white" : "#6b7280",
                    }}
                  >
                    {type === "percentage" ? "%" : "$"} {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Discount Value{" "}
                {form.discountType === "percentage" ? "(%)" : "($)"}
              </label>
              <input
                type="number"
                value={form.discountValue}
                onChange={(e) =>
                  setForm({ ...form, discountValue: Number(e.target.value) })
                }
                min={0}
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
                Min Order Amount (optional)
              </label>
              <input
                type="number"
                value={form.minOrderAmount}
                onChange={(e) =>
                  setForm({ ...form, minOrderAmount: e.target.value })
                }
                placeholder="e.g. 50"
                min={0}
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
                Max Uses (optional)
              </label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="e.g. 100"
                min={1}
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
                Expiry Date (optional)
              </label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({ ...form, expiryDate: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
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

        {/* Promo codes list */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--color-secondary)" }}
              />
            </div>
          ) : promoCodes.length === 0 ? (
            <div
              className="p-8 rounded-2xl text-center"
              style={{
                backgroundColor: "white",
                border: "1.5px solid #e5e7eb",
              }}
            >
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                No promo codes yet. Create one!
              </p>
            </div>
          ) : (
            promoCodes.map((promo) => (
              <div
                key={promo._id}
                className="p-5 rounded-2xl flex items-center gap-4"
                style={{
                  backgroundColor: "white",
                  border: "1.5px solid #e5e7eb",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--color-tertiary)" }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-headline)",
                    }}
                  >
                    {promo.discountType === "percentage" ? "%" : "$"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className="font-bold text-sm"
                      style={{ fontFamily: "var(--font-headline)" }}
                    >
                      {promo.code}
                    </p>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: promo.isActive ? "#d1fae5" : "#fee2e2",
                        color: promo.isActive ? "#065f46" : "#991b1b",
                      }}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#6b7280" }}>
                    {promo.discountValue}
                    {promo.discountType === "percentage" ? "%" : "$"} off
                    {promo.minOrderAmount
                      ? ` · Min $${promo.minOrderAmount}`
                      : ""}
                    {promo.maxUses
                      ? ` · ${promo.usedCount}/${promo.maxUses} used`
                      : ` · ${promo.usedCount} used`}
                    {promo.expiryDate
                      ? ` · Expires ${new Date(promo.expiryDate).toLocaleDateString()}`
                      : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(promo)}
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
                    onClick={() => handleDelete(promo._id)}
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
