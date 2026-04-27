"use client";

import Link from "next/link";

const cards = [
  {
    label: "User Management",
    description: "Approve, restrict, or delete users",
    href: "/admin/users",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
  {
    label: "Banner Management",
    description: "Manage homepage banners and content",
    href: "/admin/banners",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
  },
  {
    label: "Promo Codes",
    description: "Create and manage discount codes",
    href: "/admin/promo-codes",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 6h.008v.008H6V6z"
        />
      </svg>
    ),
  },
];

export default function AdminPage() {
  return (
    <div>
      <h1
        className="text-4xl font-bold mb-2"
        style={{ fontFamily: "var(--font-headline)" }}
      >
        Dashboard
      </h1>
      <p className="text-sm mb-10" style={{ color: "#6b7280" }}>
        Welcome to the Niche admin panel
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="p-6 rounded-2xl transition-all"
            style={{ backgroundColor: "white", border: "1.5px solid #e5e7eb" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--color-secondary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#e5e7eb")
            }
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                backgroundColor: "var(--color-tertiary)",
                color: "var(--color-primary)",
              }}
            >
              {card.icon}
            </div>
            <h2
              className="text-lg font-bold mb-1"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {card.label}
            </h2>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
