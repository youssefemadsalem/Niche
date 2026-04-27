"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "var(--color-neutral)" }}
    >
      <div className="text-center max-w-md">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: "#fee2e2" }}
        >
          <svg
            width="36"
            height="36"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#991b1b"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        {/* Text */}
        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Access denied
        </h1>
        <p
          className="text-sm leading-relaxed mb-10"
          style={{ color: "#6b7280" }}
        >
          You don't have permission to access this page. If you think this is a
          mistake, please contact support.
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-4 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: "var(--color-primary)", color: "white" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-secondary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
          >
            Go home
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: "white", border: "1.5px solid #e5e7eb" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--color-secondary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#e5e7eb")
            }
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
