"use client";

import { signOut } from "next-auth/react";

export default function PendingApprovalPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "var(--color-neutral)" }}
    >
      <div className="text-center max-w-md">
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
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Pending approval
        </h1>
        <p
          className="text-sm leading-relaxed mb-2"
          style={{ color: "#6b7280" }}
        >
          Your seller account is currently under review. Our team will approve
          your account shortly.
        </p>
        <p className="text-sm mb-10" style={{ color: "#6b7280" }}>
          You'll receive an email once your account has been{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            approved
          </span>
          .
        </p>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
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
        </button>
      </div>
    </div>
  );
}
