"use client";

import { AuthGate } from "@/components/features/user/AuthGate";
import { usePathname } from "next/navigation";
import { NavBar } from "./NavBar";

const authRoutePrefixes = ["/login", "/signup"];

export const AppFrame = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isAuthRoute = authRoutePrefixes.some((prefix) =>
        pathname.startsWith(prefix),
    );

    return (
        <AuthGate>
            <div className={isAuthRoute ? "min-h-screen" : "min-h-screen pb-20"}>
                {children}
            </div>
            {!isAuthRoute && <NavBar />}
        </AuthGate>
    );
};
