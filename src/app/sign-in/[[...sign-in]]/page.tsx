import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
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
            <SignIn />
        </div>
    );
}
