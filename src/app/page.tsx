"use client";

import { useEffect, useState } from "react";
import { TestimonialCard } from "@/components/testimonial-card";

interface Testimonial {
    id: string;
    name: string;
    message: string;
    is_anonymous: boolean;
    image_url?: string | null;
    created_at: string;
}

export default function HomePage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/testimonials")
            .then((res) => res.json())
            .then((data) => {
                setTestimonials(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
            {/* Hero Section */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "3rem",
                }}
            >
                <h1
                    style={{
                        fontSize: "2.5rem",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        color: "var(--color-foreground)",
                        marginBottom: "0.75rem",
                    }}
                >
                    What People Are Saying
                </h1>
                <p
                    style={{
                        fontSize: "1.125rem",
                        color: "var(--color-muted)",
                        maxWidth: "32rem",
                        margin: "0 auto",
                    }}
                >
                    Real feedback from real people. See what others have shared about
                    their experience.
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "4rem 0",
                    }}
                >
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

            {/* Empty State */}
            {!loading && testimonials.length === 0 && (
                <div
                    className="card"
                    style={{
                        padding: "4rem 2rem",
                        textAlign: "center",
                    }}
                >
                    <p
                        style={{
                            fontSize: "3rem",
                            marginBottom: "1rem",
                        }}
                    >
                        ✦
                    </p>
                    <p
                        style={{
                            fontSize: "1.125rem",
                            fontWeight: 600,
                            color: "var(--color-foreground)",
                            marginBottom: "0.5rem",
                        }}
                    >
                        No testimonials yet
                    </p>
                    <p
                        style={{
                            color: "var(--color-muted)",
                            fontSize: "0.9375rem",
                        }}
                    >
                        Be the first to share your experience!
                    </p>
                </div>
            )}

            {/* Testimonials Grid */}
            {!loading && testimonials.length > 0 && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 22rem), 1fr))",
                        gap: "1.25rem",
                    }}
                >
                    {testimonials.map((t) => (
                        <TestimonialCard key={t.id} {...t} />
                    ))}
                </div>
            )}
        </div>
    );
}
