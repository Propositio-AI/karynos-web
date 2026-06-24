"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "../atoms/Button";
import type { NavType } from "@/types/ui/atoms/Button";

import {
    faFireFlameSimple,
    faMagnifyingGlass,
    faHouse,
    faMap,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type NavBarProps = {
    active?: NavType;
    className?: string;
};

type NavItem = {
    type: NavType;
    label: string;
    href?: string;
    dimWhenDisabled?: boolean;
    isActive: (pathname: string) => boolean;
    icon: IconDefinition;
};

const navItems: NavItem[] = [
    {
        type: "match",
        label: "マッチ",
        href: "/job/match",
        isActive: (pathname) => pathname.startsWith("/job/match"),
        icon: faFireFlameSimple,
    },
    {
        type: "explore",
        label: "探査",
        href: "/job/search",
        isActive: (pathname) => pathname.startsWith("/job/search"),
        icon: faMagnifyingGlass,
    },
    {
        type: "home",
        label: "ホーム",
        href: undefined,
        dimWhenDisabled: false,
        isActive: (pathname) => pathname === "/",
        icon: faHouse,
    },
    {
        type: "map",
        label: "マップ",
        href: undefined,
        isActive: (pathname) => pathname.startsWith("/map"),
        icon: faMap,
    },
    {
        type: "setting",
        label: "設定",
        href: undefined,
        isActive: (pathname) => pathname.startsWith("/setting"),
        icon: faUser,
    },
];

export const NavBar = ({ active, className = "" }: NavBarProps) => {
    const pathname = usePathname();
    const activeType = active ?? navItems.find((item) => item.isActive(pathname))?.type;

    return (
        <nav
            aria-label="Primary"
            className={`fixed inset-x-4 bottom-3 z-50 mx-auto max-w-[680px] rounded-full border border-line/80 bg-surface/90 px-3 py-2 shadow-lift backdrop-blur-md ${className}`}
        >
            <div className="grid grid-cols-5 gap-1">
                {navItems.map((item) => {
                    const isActive = item.type === activeType;
                    const content = (
                        <NavIcon icon={item.icon} label={item.label} active={isActive} />
                    );

                    if (!item.href) {
                        return (
                            <div
                                key={item.type}
                                aria-disabled
                                className={
                                    item.dimWhenDisabled === false
                                        ? "pointer-events-none"
                                        : "pointer-events-none opacity-55"
                                }
                            >
                                {content}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.type}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className="rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-100"
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
