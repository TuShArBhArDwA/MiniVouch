import Image from "next/image";

interface TestimonialCardProps {
    name: string;
    message: string;
    is_anonymous: boolean;
    image_url?: string | null;
    created_at: string;
}

export function TestimonialCard({
    name,
    message,
    is_anonymous,
    image_url,
    created_at,
}: TestimonialCardProps) {
    const displayName = is_anonymous ? "Anonymous" : name;
    const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div
            className="card"
            style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                }}
            >
                {!is_anonymous && image_url ? (
                    <Image
                        src={image_url}
                        alt={displayName}
                        width={40}
                        height={40}
                        style={{
                            borderRadius: "9999px",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "9999px",
                            background:
                                "linear-gradient(135deg, var(--color-primary-light), var(--color-primary))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            flexShrink: 0,
                        }}
                    >
                        {is_anonymous ? "?" : displayName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div style={{ minWidth: 0 }}>
                    <p
                        style={{
                            fontWeight: 600,
                            fontSize: "0.9375rem",
                            color: "var(--color-card-foreground)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {displayName}
                    </p>
                    <p
                        style={{
                            fontSize: "0.75rem",
                            color: "var(--color-muted)",
                        }}
                    >
                        {formattedDate}
                    </p>
                </div>
            </div>

            <p
                style={{
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                    color: "var(--color-card-foreground)",
                }}
            >
                {message}
            </p>
        </div>
    );
}
