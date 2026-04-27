"use client";

import Link from "next/link";

export default function VerifyNoticePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "var(--color-neutral)" }}
    >
      <div className="text-center max-w-md">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: "var(--color-tertiary)" }}
        >
          <svg
            width="36"
            height="36"
            fill="none"
            viewBox="0 0 24 24"
            stroke="var(--color-secondary)"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>

        {/* Text */}
        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Check your email
        </h1>
        <p
          className="text-sm leading-relaxed mb-2"
          style={{ color: "#6b7280" }}
        >
          We sent a verification link to your email address. Please click the
          link to verify your account before continuing.
        </p>
        <p className="text-sm mb-10" style={{ color: "#6b7280" }}>
          The link will expire in{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            24 hours
          </span>
          .
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="w-full py-4 rounded-xl text-sm font-semibold text-center transition-all"
            style={{ backgroundColor: "var(--color-primary)", color: "white" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-secondary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
          >
            Back to login
          </Link>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Didn't receive it? Check your spam folder or{" "}
            <Link
              href="/auth/register"
              className="font-semibold"
              style={{ color: "var(--color-secondary)" }}
            >
              try again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
