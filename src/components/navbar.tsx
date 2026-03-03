"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";

export function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Wall" },
        { href: "/submit", label: "Submit" },
        { href: "/dashboard", label: "My Testimonials" },
        { href: "/admin", label: "Admin" },
    ];

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                backdropFilter: "blur(12px)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            <div
                style={{
                    maxWidth: "72rem",
                    margin: "0 auto",
                    padding: "0 1.5rem",
                    height: "4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <Link
                        href="/"
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "var(--color-primary)",
                            textDecoration: "none",
                            letterSpacing: "-0.025em",
                        }}
                    >
                        ✦ Testimonials
                    </Link>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                        }}
                    >
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        padding: "0.5rem 0.75rem",
                                        borderRadius: "0.5rem",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: isActive
                                            ? "var(--color-primary)"
                                            : "var(--color-muted)",
                                        backgroundColor: isActive
                                            ? "var(--color-primary-light)"
                                            : "transparent",
                                        textDecoration: "none",
                                        transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = "var(--color-foreground)";
                                            e.currentTarget.style.backgroundColor =
                                                "var(--color-muted-light)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = "var(--color-muted)";
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="btn-primary">Sign In</button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: {
                                        width: "2rem",
                                        height: "2rem",
                                    },
                                },
                            }}
                        />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
