import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(100vh - 4rem)",
                padding: "2rem",
            }}
        >
            <SignUp />
        </div>
    );
}
