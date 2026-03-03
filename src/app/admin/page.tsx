"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { StatusBadge } from "@/components/status-badge";

interface Testimonial {
    id: string;
    user_id: string;
    name: string;
    message: string;
    is_anonymous: boolean;
    image_url?: string | null;
    status: "pending" | "approved" | "rejected";
    created_at: string;
}

type Tab = "pending" | "approved" | "rejected";

export default function AdminPage() {
    const { user } = useUser();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("pending");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        loadTestimonials();
    }, []);

    async function loadTestimonials() {
        setLoading(true);
        try {
            const res = await fetch("/api/testimonials/admin");
            if (res.status === 403) {
                setUnauthorized(true);
                setLoading(false);
                return;
            }
            const data = await res.json();
            setTestimonials(data);
        } catch {
            // Handle error silently
        }
        setLoading(false);
    }

    async function updateStatus(id: string, status: string) {
        setActionLoading(id);
        try {
            await fetch("/api/testimonials/admin", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            setTestimonials((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, status: status as Testimonial["status"] } : t
                )
            );
        } catch {
            // Handle error silently
        }
        setActionLoading(null);
    }

    async function deleteTestimonial(id: string) {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        setActionLoading(id);
        try {
            await fetch("/api/testimonials/admin", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            setTestimonials((prev) => prev.filter((t) => t.id !== id));
        } catch {
            // Handle error silently
        }
        setActionLoading(null);
    }

    // Unauthorized view
    if (unauthorized) {
        return (
            <div style={{ maxWidth: "36rem", margin: "0 auto", padding: "4rem 1.5rem" }}>
                <div
                    className="card"
                    style={{ padding: "3rem 2rem", textAlign: "center" }}
                >
                    <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</p>
                    <h2
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            marginBottom: "0.5rem",
                            color: "var(--color-foreground)",
                        }}
                    >
                        Access Denied
                    </h2>
                    <p style={{ color: "var(--color-muted)", fontSize: "0.9375rem" }}>
                        You don&apos;t have permission to view this page.
                    </p>
                </div>
            </div>
        );
    }

    const filtered = testimonials.filter((t) => t.status === activeTab);
    const tabs: Tab[] = ["pending", "approved", "rejected"];

    return (
        <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1
                    style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        letterSpacing: "-0.025em",
                        color: "var(--color-foreground)",
                        marginBottom: "0.5rem",
                    }}
                >
                    Admin Panel
                </h1>
                <p style={{ color: "var(--color-muted)", fontSize: "0.9375rem" }}>
                    Manage submitted testimonials. Approve, reject, or delete entries.
                </p>
            </div>

            {/* Tabs */}
            <div
                style={{
                    display: "flex",
                    gap: "0.25rem",
                    marginBottom: "1.5rem",
                    padding: "0.25rem",
                    backgroundColor: "var(--color-muted-light)",
                    borderRadius: "0.75rem",
                    width: "fit-content",
                }}
            >
                {tabs.map((tab) => {
                    const count = testimonials.filter((t) => t.status === tab).length;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "0.5rem",
                                border: "none",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                backgroundColor:
                                    activeTab === tab ? "white" : "transparent",
                                color:
                                    activeTab === tab
                                        ? "var(--color-foreground)"
                                        : "var(--color-muted)",
                                boxShadow:
                                    activeTab === tab
                                        ? "0 1px 3px rgba(0,0,0,0.08)"
                                        : "none",
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span
                                style={{
                                    marginLeft: "0.375rem",
                                    fontSize: "0.75rem",
                                    opacity: 0.7,
                                }}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
                    <div
                        style={{
                            width: "2rem",
                            height: "2rem",
                            border: "3px solid var(--color-border)",
                            borderTopColor: "var(--color-primary)",
                            borderRadius: "9999px",
                            animation: "spin 0.8s linear infinite",
                        }}
                    />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
                <div
                    className="card"
                    style={{ padding: "3rem 2rem", textAlign: "center" }}
                >
                    <p style={{ color: "var(--color-muted)", fontSize: "0.9375rem" }}>
                        No {activeTab} testimonials.
                    </p>
                </div>
            )}

            {/* Testimonials List */}
            {!loading && filtered.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {filtered.map((t) => (
                        <div
                            key={t.id}
                            className="card"
                            style={{ padding: "1.25rem 1.5rem" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "0.75rem",
                                }}
                            >
                                <div>
                                    <p
                                        style={{
                                            fontWeight: 600,
                                            fontSize: "0.9375rem",
                                            color: "var(--color-card-foreground)",
                                        }}
                                    >
                                        {t.is_anonymous ? "Anonymous" : t.name}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "0.75rem",
                                            color: "var(--color-muted)",
                                            marginTop: "0.125rem",
                                        }}
                                    >
                                        {new Date(t.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <StatusBadge status={t.status} />
                            </div>

                            <p
                                style={{
                                    fontSize: "0.9375rem",
                                    lineHeight: 1.6,
                                    color: "var(--color-card-foreground)",
                                    marginBottom: "1rem",
                                }}
                            >
                                {t.message}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    borderTop: "1px solid var(--color-border)",
                                    paddingTop: "0.75rem",
                                }}
                            >
                                {t.status !== "approved" && (
                                    <button
                                        className="btn-success"
                                        onClick={() => updateStatus(t.id, "approved")}
                                        disabled={actionLoading === t.id}
                                    >
                                        Approve
                                    </button>
                                )}
                                {t.status !== "rejected" && (
                                    <button
                                        className="btn-outline"
                                        onClick={() => updateStatus(t.id, "rejected")}
                                        disabled={actionLoading === t.id}
                                        style={{
                                            fontSize: "0.8125rem",
                                        }}
                                    >
                                        Reject
                                    </button>
                                )}
                                <button
                                    className="btn-danger"
                                    onClick={() => deleteTestimonial(t.id)}
                                    disabled={actionLoading === t.id}
                                    style={{ marginLeft: "auto" }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
