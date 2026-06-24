"use client";

import { logoutCurrentUser } from "@/lib/auth/session";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logoutCurrentUser();
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="rounded-(--radius-sm) px-3 py-2 text-sm font-semibold text-muted hover:bg-line/40 hover:text-ink"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
