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
            className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
