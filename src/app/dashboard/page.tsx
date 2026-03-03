"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/status-badge";

interface Testimonial {
    id: string;
    name: string;
    message: string;
    is_anonymous: boolean;
    status: "pending" | "approved" | "rejected";
    created_at: string;
}

export default function DashboardPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/testimonials/user")
            .then((res) => res.json())
            .then((data) => {
                setTestimonials(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
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
                    My Testimonials
                </h1>
                <p
                    style={{
                        color: "var(--color-muted)",
                        fontSize: "0.9375rem",
                    }}
                >
                    Track the status of your submitted testimonials.
                </p>
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
            {!loading && testimonials.length === 0 && (
                <div
                    className="card"
                    style={{
                        padding: "3rem 2rem",
                        textAlign: "center",
                    }}
                >
                    <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📝</p>
                    <p
                        style={{
                            fontWeight: 600,
                            fontSize: "1.0625rem",
                            color: "var(--color-foreground)",
                            marginBottom: "0.5rem",
                        }}
                    >
                        No testimonials yet
                    </p>
                    <p style={{ color: "var(--color-muted)", fontSize: "0.9375rem" }}>
                        You haven&apos;t submitted any testimonials.
                    </p>
                    <a
                        href="/submit"
                        className="btn-primary"
                        style={{
                            marginTop: "1.25rem",
                            textDecoration: "none",
                            display: "inline-flex",
                        }}
                    >
                        Submit One Now
                    </a>
                </div>
            )}

            {/* Testimonials List */}
            {!loading && testimonials.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="card"
                            style={{
                                padding: "1.25rem 1.5rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "1rem",
                            }}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: 1.6,
                                        color: "var(--color-card-foreground)",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    {t.message}
                                </p>
                                <p style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                                    {new Date(t.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                    {t.is_anonymous && " · Anonymous"}
                                </p>
                            </div>
                            <StatusBadge status={t.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
