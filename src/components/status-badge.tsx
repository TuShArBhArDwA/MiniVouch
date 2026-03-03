interface StatusBadgeProps {
    status: "pending" | "approved" | "rejected";
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const classMap = {
        pending: "badge badge-pending",
        approved: "badge badge-approved",
        rejected: "badge badge-rejected",
    };

    return <span className={classMap[status]}>{status}</span>;
}
