"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        setError("Invalid email or password");
      } else if (res.error === "Configuration") {
        setError("Please verify your email first");
      } else {
        setError("Something went wrong. Please try again.");
      }
      return;
    }

    router.push("/");
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/" });

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
        <div>
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Niche
          </h1>
        </div>
        <div>
          <p
            className="text-5xl font-bold leading-tight mb-6"
            style={{
              color: "var(--color-tertiary)",
              fontFamily: "var(--font-headline)",
            }}
          >
            Your premium <br /> marketplace
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--color-tertiary)", opacity: 0.7 }}
          >
            Discover curated products from trusted sellers around the world.
          </p>
        </div>
        <div className="flex gap-2">
          <div
            className="w-8 h-1 rounded-full"
            style={{ backgroundColor: "var(--color-secondary)" }}
          />
          <div className="w-2 h-1 rounded-full bg-white opacity-30" />
          <div className="w-2 h-1 rounded-full bg-white opacity-30" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
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
            Welcome back
          </h2>
          <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
            Sign in to continue to your account
          </p>

          {/* Verified notice */}
          {verified && (
            <div
              className="mb-6 p-4 rounded-xl text-sm"
              style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
            >
              ✅ Email verified successfully! You can now sign in.
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="mb-6 p-4 rounded-xl text-sm"
              style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: "white",
                  border: "1.5px solid #e5e7eb",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm"
                  style={{ color: "var(--color-secondary)" }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: "white",
                  border: "1.5px solid #e5e7eb",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-secondary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Divider */}
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

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 transition-all"
            style={{
              backgroundColor: "white",
              border: "1.5px solid #e5e7eb",
              fontFamily: "var(--font-body)",
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

          <p className="text-center text-sm mt-8" style={{ color: "#6b7280" }}>
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold"
              style={{ color: "var(--color-secondary)" }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
