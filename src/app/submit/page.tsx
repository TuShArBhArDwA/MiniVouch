"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function SubmitPage() {
    const { user } = useUser();
    const [message, setMessage] = useState("");
    const [name, setName] = useState(user?.fullName || "");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    // Update name when user loads
    if (user?.fullName && !name && !isAnonymous) {
        setName(user.fullName);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    name: isAnonymous ? "Anonymous" : name,
                    is_anonymous: isAnonymous,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Something went wrong");
            }

            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div style={{ maxWidth: "36rem", margin: "0 auto", padding: "4rem 1.5rem" }}>
                <div
                    className="card"
                    style={{
                        padding: "3rem 2rem",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: "3.5rem",
                            height: "3.5rem",
                            borderRadius: "9999px",
                            backgroundColor: "var(--color-success-light)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1.25rem",
                            fontSize: "1.5rem",
                        }}
                    >
                        ✓
                    </div>
                    <h2
                        style={{
                            fontSize: "1.375rem",
                            fontWeight: 700,
                            marginBottom: "0.75rem",
                            color: "var(--color-foreground)",
                        }}
                    >
                        Thank you!
                    </h2>
                    <p
                        style={{
                            color: "var(--color-muted)",
                            fontSize: "0.9375rem",
                            lineHeight: 1.6,
                        }}
                    >
                        Your testimonial has been submitted and is under review. It will
                        appear on the public wall once approved.
                    </p>
                    <a
                        href="/dashboard"
                        className="btn-primary"
                        style={{
                            marginTop: "1.5rem",
                            textDecoration: "none",
                            display: "inline-flex",
                        }}
                    >
                        View My Testimonials
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "36rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
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
                    Share Your Experience
                </h1>
                <p
                    style={{
                        color: "var(--color-muted)",
                        fontSize: "0.9375rem",
                    }}
                >
                    We would love to hear what you think. Your feedback helps us improve.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div
                    className="card"
                    style={{
                        padding: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.25rem",
                    }}
                >
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            style={{
                                display: "block",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                marginBottom: "0.375rem",
                                color: "var(--color-card-foreground)",
                            }}
                        >
                            Your Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={isAnonymous ? "Anonymous" : name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isAnonymous}
                            placeholder="Enter your name"
                            style={{
                                width: "100%",
                                padding: "0.625rem 0.875rem",
                                borderRadius: "0.5rem",
                                border: "1px solid var(--color-border)",
                                fontSize: "0.9375rem",
                                outline: "none",
                                transition: "border-color 0.15s ease",
                                backgroundColor: isAnonymous
                                    ? "var(--color-muted-light)"
                                    : "white",
                                color: "var(--color-card-foreground)",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "var(--color-primary)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "var(--color-border)";
                            }}
                        />
                    </div>

                    {/* Message Field */}
                    <div>
                        <label
                            htmlFor="message"
                            style={{
                                display: "block",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                marginBottom: "0.375rem",
                                color: "var(--color-card-foreground)",
                            }}
                        >
                            Your Message <span style={{ color: "var(--color-danger)" }}>*</span>
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Share your experience..."
                            required
                            rows={5}
                            style={{
                                width: "100%",
                                padding: "0.625rem 0.875rem",
                                borderRadius: "0.5rem",
                                border: "1px solid var(--color-border)",
                                fontSize: "0.9375rem",
                                outline: "none",
                                resize: "vertical",
                                fontFamily: "inherit",
                                transition: "border-color 0.15s ease",
                                color: "var(--color-card-foreground)",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "var(--color-primary)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "var(--color-border)";
                            }}
                        />
                    </div>

                    {/* Anonymous Checkbox */}
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            color: "var(--color-card-foreground)",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            style={{
                                width: "1rem",
                                height: "1rem",
                                accentColor: "var(--color-primary)",
                                cursor: "pointer",
                            }}
                        />
                        Post as Anonymous
                    </label>

                    {/* Error */}
                    {error && (
                        <p
                            style={{
                                color: "var(--color-danger)",
                                fontSize: "0.875rem",
                                padding: "0.5rem 0.75rem",
                                backgroundColor: "var(--color-danger-light)",
                                borderRadius: "0.5rem",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || !message.trim()}
                        style={{ width: "100%", padding: "0.75rem" }}
                    >
                        {loading ? "Submitting..." : "Submit Testimonial"}
                    </button>
                </div>
            </form>
        </div>
    );
}
