"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer" as "customer" | "seller",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setSuccess(data.message);
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/" });

  const inputStyle = {
    backgroundColor: "white",
    border: "1.5px solid #e5e7eb",
    fontFamily: "var(--font-body)",
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--color-neutral)" }}
    >
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <h1
          className="text-4xl font-bold text-white"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Niche
        </h1>
        <div>
          <p
            className="text-5xl font-bold leading-tight mb-6"
            style={{
              color: "var(--color-tertiary)",
              fontFamily: "var(--font-headline)",
            }}
          >
            Join our <br /> community
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--color-tertiary)", opacity: 0.7 }}
          >
            Buy, sell, and discover unique products from around the world.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-1 rounded-full bg-white opacity-30" />
          <div
            className="w-8 h-1 rounded-full"
            style={{ backgroundColor: "var(--color-secondary)" }}
          />
          <div className="w-2 h-1 rounded-full bg-white opacity-30" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1
            className="text-3xl font-bold mb-8 lg:hidden"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--color-primary)",
            }}
          >
            Niche
          </h1>

          <h2
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Create account
          </h2>
          <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
            Fill in your details to get started
          </p>

          {error && (
            <div
              className="mb-6 p-4 rounded-xl text-sm"
              style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="mb-6 p-4 rounded-xl text-sm"
              style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
            >
              {success}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role toggle */}
              <div
                className="flex rounded-xl p-1 gap-1"
                style={{
                  backgroundColor: "white",
                  border: "1.5px solid #e5e7eb",
                }}
              >
                {(["customer", "seller"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                    style={{
                      backgroundColor:
                        form.role === r
                          ? "var(--color-primary)"
                          : "transparent",
                      color: form.role === r ? "white" : "#6b7280",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />

              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />

              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />

              <input
                type="password"
                placeholder="Password (min 8 characters)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  opacity: loading ? 0.7 : 1,
                  fontFamily: "var(--font-body)",
                }}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          {!success && (
            <>
              <div className="flex items-center gap-4 my-6">
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "#e5e7eb" }}
                />
                <span className="text-xs" style={{ color: "#9ca3af" }}>
                  or continue with
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "#e5e7eb" }}
                />
              </div>

              <button
                onClick={handleGoogle}
                className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-3"
                style={{
                  backgroundColor: "white",
                  border: "1.5px solid #e5e7eb",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                  />
                </svg>
                Continue with Google
              </button>
            </>
          )}

          <p className="text-center text-sm mt-8" style={{ color: "#6b7280" }}>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold"
              style={{ color: "var(--color-secondary)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
