"use client";

import { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, page]);

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (roleFilter) params.append("role", roleFilter);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  const showFeedback = (message: string, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback({ message: "", isError: false }), 3000);
  };

  const handleToggleApprove = async (id: string, current: boolean) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: !current }),
    });
    if (!res.ok) return showFeedback("Failed to update user", true);
    showFeedback("User updated successfully");
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) return showFeedback("Failed to delete user", true);
    showFeedback("User deleted successfully");
    fetchUsers();
  };

  const roles = ["", "customer", "seller", "admin"];

  return (
    <div>
      <h1
        className="text-4xl font-bold mb-2"
        style={{ fontFamily: "var(--font-headline)" }}
      >
        User Management
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
        Manage all registered users
      </p>

      {/* Feedback */}
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

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => {
              setRoleFilter(role);
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all"
            style={{
              backgroundColor:
                roleFilter === role ? "var(--color-primary)" : "white",
              color: roleFilter === role ? "white" : "#6b7280",
              border: "1.5px solid #e5e7eb",
            }}
          >
            {role === "" ? "All" : role}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "white", border: "1.5px solid #e5e7eb" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--color-secondary)" }}
            />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1.5px solid #e5e7eb" }}>
                {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#9ca3af" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          backgroundColor: "var(--color-tertiary)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs" style={{ color: "#9ca3af" }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                      style={{
                        backgroundColor:
                          user.role === "admin"
                            ? "#1a1a1a"
                            : user.role === "seller"
                              ? "var(--color-tertiary)"
                              : "#f3f4f6",
                        color:
                          user.role === "admin"
                            ? "white"
                            : "var(--color-primary)",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold w-fit"
                        style={{
                          backgroundColor: user.isVerified
                            ? "#d1fae5"
                            : "#fee2e2",
                          color: user.isVerified ? "#065f46" : "#991b1b",
                        }}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold w-fit"
                        style={{
                          backgroundColor: user.isApproved
                            ? "#d1fae5"
                            : "#fef3c7",
                          color: user.isApproved ? "#065f46" : "#92400e",
                        }}
                      >
                        {user.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 text-sm"
                    style={{ color: "#6b7280" }}
                  >
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleToggleApprove(user._id, user.isApproved)
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: user.isApproved
                            ? "#fef3c7"
                            : "#d1fae5",
                          color: user.isApproved ? "#92400e" : "#065f46",
                        }}
                      >
                        {user.isApproved ? "Restrict" : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: "white",
              border: "1.5px solid #e5e7eb",
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            Previous
          </button>
          <span className="text-sm" style={{ color: "#6b7280" }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: "white",
              border: "1.5px solid #e5e7eb",
              opacity: page === totalPages ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
