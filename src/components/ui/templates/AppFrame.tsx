"use client";

import { AuthGate } from "@/components/features/user/AuthGate";
import { usePathname } from "next/navigation";
import { NavBar } from "./NavBar";

const authRoutePrefixes = ["/login", "/signup"];
const noNavBarPattern = /^\/chat\/[^/]+$/;

export const AppFrame = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const isAuthRoute = authRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
	const hideNavBar = isAuthRoute || noNavBarPattern.test(pathname);

	return (
		<AuthGate>
			<div
				className={
					hideNavBar
						? "min-h-screen"
						: "min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))]"
				}
			>
				{children}
			</div>
			{!hideNavBar && <NavBar />}
		</AuthGate>
	);
};
