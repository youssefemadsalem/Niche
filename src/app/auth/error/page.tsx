"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const errorMessages: Record<string, string> = {
  "missing-token":
    "The verification link is missing. Please request a new one.",
  "invalid-token":
    "This verification link is invalid or has expired. Please request a new one.",
  "server-error": "Something went wrong on our end. Please try again later.",
  default: "An unexpected error occurred. Please try again.",
};

// 1. Sub-component to read search parameters safely on the client side
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "default";
  const message = errorMessages[error] ?? errorMessages.default;

  return (
    <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
      {message}
    </p>
  );
}

// 2. Main page export wrapped in Suspense
export default function AuthErrorPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "var(--color-neutral)" }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#fee2e2" }}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#991b1b"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
            />
          </svg>
        </div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Something went wrong
        </h1>

        {/* 3. Wrap your searchParams-dependent component inside a Suspense boundary */}
        <Suspense fallback={<p className="text-sm mb-8 text-gray-400">Loading error details...</p>}>
          <ErrorContent />
        </Suspense>

        <div className="flex gap-3 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "var(--color-primary)", color: "white" }}
          >
            Back to login
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "white", border: "1.5px solid #e5e7eb" }}
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}