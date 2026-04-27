"use client";

import { useState, useEffect } from "react";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface PaymentDetail {
  _id: string;
  cardholderName: string;
  lastFourDigits: string;
  expiryDate: string;
  paymentType: "credit" | "debit";
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  image: string;
  role: string;
  address?: Address;
  paymentDetails?: PaymentDetail[];
}

type ActiveTab = "profile" | "address" | "payment";

const inputStyle = {
  backgroundColor: "white",
  border: "1.5px solid #e5e7eb",
  fontFamily: "var(--font-body)",
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    image: "",
  });

  // Address form
  const [addressForm, setAddressForm] = useState<Address>({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  // Payment form
  const [paymentForm, setPaymentForm] = useState({
    cardholderName: "",
    lastFourDigits: "",
    expiryDate: "",
    paymentType: "credit" as "credit" | "debit",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setProfile(data.user);
      setProfileForm({
        name: data.user.name ?? "",
        phone: data.user.phone ?? "",
        image: data.user.image ?? "",
      });
      setAddressForm({
        street: data.user.address?.street ?? "",
        city: data.user.address?.city ?? "",
        state: data.user.address?.state ?? "",
        country: data.user.address?.country ?? "",
        zipCode: data.user.address?.zipCode ?? "",
      });
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (msg: string, isError = false) => {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  const handleProfileSave = async () => {
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return showFeedback(data.error, true);
    showFeedback("Profile updated successfully");
    fetchProfile();
  };

  const handleAddressSave = async () => {
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: addressForm }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return showFeedback(data.error, true);
    showFeedback("Address updated successfully");
  };

  const handleAddPayment = async () => {
    setSaving(true);
    const res = await fetch("/api/user/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentForm),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return showFeedback(data.error, true);
    showFeedback("Payment method added");
    setPaymentForm({
      cardholderName: "",
      lastFourDigits: "",
      expiryDate: "",
      paymentType: "credit",
    });
    fetchProfile();
  };

  const handleDeletePayment = async (id: string) => {
    const res = await fetch(`/api/user/payment?id=${id}`, { method: "DELETE" });
    if (!res.ok) return showFeedback("Failed to remove payment method", true);
    showFeedback("Payment method removed");
    fetchProfile();
  };

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: "profile", label: "Personal Info" },
    { key: "address", label: "Address" },
    { key: "payment", label: "Payment Methods" },
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-neutral)" }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-secondary)" }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: "var(--color-neutral)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl font-bold mb-1"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            My Profile
          </h1>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Manage your personal information and preferences
          </p>
        </div>

        {/* Avatar & role */}
        <div
          className="flex items-center gap-5 p-6 rounded-2xl mb-8"
          style={{ backgroundColor: "white", border: "1.5px solid #e5e7eb" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
            style={{
              backgroundColor: "var(--color-tertiary)",
              color: "var(--color-primary)",
              fontFamily: "var(--font-headline)",
            }}
          >
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p
              className="font-semibold text-lg"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {profile?.name}
            </p>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              {profile?.email}
            </p>
            <span
              className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold capitalize"
              style={{
                backgroundColor: "var(--color-tertiary)",
                color: "var(--color-primary)",
              }}
            >
              {profile?.role}
            </span>
          </div>
        </div>

        {/* Feedback */}
        {success && (
          <div
            className="mb-6 p-4 rounded-xl text-sm"
            style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
          >
            ✅ {success}
          </div>
        )}
        {error && (
          <div
            className="mb-6 p-4 rounded-xl text-sm"
            style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
          >
            {error}
          </div>
        )}

        {/* Tabs */}
        <div
          className="flex rounded-xl p-1 gap-1 mb-8"
          style={{ backgroundColor: "white", border: "1.5px solid #e5e7eb" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor:
                  activeTab === tab.key
                    ? "var(--color-primary)"
                    : "transparent",
                color: activeTab === tab.key ? "white" : "#6b7280",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className="p-8 rounded-2xl"
          style={{ backgroundColor: "white", border: "1.5px solid #e5e7eb" }}
        >
          {/* Personal Info Tab */}
          {activeTab === "profile" && (
            <div className="space-y-5">
              <h2
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Personal Information
              </h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-secondary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile?.email ?? ""}
                  disabled
                  className="w-full px-5 py-4 rounded-xl text-sm outline-none"
                  style={{
                    ...inputStyle,
                    backgroundColor: "#f9fafb",
                    color: "#9ca3af",
                  }}
                />
                <p className="text-xs mt-1.5" style={{ color: "#9ca3af" }}>
                  Email cannot be changed
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  placeholder="e.g. +1 234 567 8900"
                  className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-secondary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={profileForm.image}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, image: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-secondary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              <button
                onClick={handleProfileSave}
                disabled={saving}
                className="w-full py-4 rounded-xl text-sm font-semibold transition-all mt-2"
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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === "address" && (
            <div className="space-y-5">
              <h2
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Delivery Address
              </h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  placeholder="123 Main St"
                  className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-secondary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    placeholder="New York"
                    className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--color-secondary)")
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    placeholder="NY"
                    className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--color-secondary)")
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    placeholder="United States"
                    className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--color-secondary)")
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={addressForm.zipCode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        zipCode: e.target.value,
                      })
                    }
                    placeholder="10001"
                    className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--color-secondary)")
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </div>
              <button
                onClick={handleAddressSave}
                disabled={saving}
                className="w-full py-4 rounded-xl text-sm font-semibold transition-all mt-2"
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
                {saving ? "Saving..." : "Save Address"}
              </button>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h2
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Payment Methods
              </h2>

              {/* Saved cards */}
              {profile?.paymentDetails && profile.paymentDetails.length > 0 ? (
                <div className="space-y-3 mb-8">
                  {profile.paymentDetails.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{
                        backgroundColor: "var(--color-neutral)",
                        border: "1.5px solid #e5e7eb",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "var(--color-tertiary)" }}
                        >
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="var(--color-secondary)"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {payment.cardholderName}
                          </p>
                          <p className="text-xs" style={{ color: "#6b7280" }}>
                            •••• {payment.lastFourDigits} · {payment.expiryDate}{" "}
                            · {payment.paymentType}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePayment(payment._id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>
                  No payment methods saved yet.
                </p>
              )}

              {/* Divider */}
              <div className="h-px" style={{ backgroundColor: "#e5e7eb" }} />
              <p className="text-sm font-semibold">Add new payment method</p>

              {/* Add payment form */}
              <div className="space-y-4">
                <div
                  className="flex rounded-xl p-1 gap-1"
                  style={{
                    backgroundColor: "var(--color-neutral)",
                    border: "1.5px solid #e5e7eb",
                  }}
                >
                  {(["credit", "debit"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setPaymentForm({ ...paymentForm, paymentType: type })
                      }
                      className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                      style={{
                        backgroundColor:
                          paymentForm.paymentType === type
                            ? "var(--color-primary)"
                            : "transparent",
                        color:
                          paymentForm.paymentType === type
                            ? "white"
                            : "#6b7280",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={paymentForm.cardholderName}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      cardholderName: e.target.value,
                    })
                  }
                  placeholder="Cardholder name"
                  className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-secondary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={paymentForm.lastFourDigits}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        lastFourDigits: e.target.value,
                      })
                    }
                    placeholder="Last 4 digits"
                    maxLength={4}
                    className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--color-secondary)")
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                  <input
                    type="text"
                    value={paymentForm.expiryDate}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        expiryDate: e.target.value,
                      })
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--color-secondary)")
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
                <button
                  onClick={handleAddPayment}
                  disabled={saving}
                  className="w-full py-4 rounded-xl text-sm font-semibold transition-all"
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
                  {saving ? "Adding..." : "Add Payment Method"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
