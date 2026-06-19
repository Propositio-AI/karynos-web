"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridContainer } from "../molecules/Container";
import { NavIcon } from "../atoms/Button";
import { NavType } from "@/types/ui/atoms/Button";

import {
    faFireFlameSimple,
    faMagnifyingGlass,
    faHouse,
    faBook,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type NavBarProps = {
    active?: NavType;
    className?: string;
};

type NavItem = {
    type: NavType;
    label: string;
    href?: string;
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
        label: "探検",
        href: "/job/search",
        isActive: (pathname) => pathname.startsWith("/job/search"),
        icon: faMagnifyingGlass,
    },
    {
        type: "home",
        label: "ホーム",
        href: "/",
        isActive: (pathname) => pathname === "/",
        icon: faHouse,
    },
    {
        type: "dream-action",
        label: "教材",
        href: "/dream-action",
        isActive: (pathname) => pathname.startsWith("/dream-action"),
        icon: faBook,
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
        <GridContainer
            minWidth={32}
            className={`fixed bottom-2 left-1/2 -translate-x-1/2 w-full max-w-180 mx-auto px-5 py-2 border border-zinc-200 bg-white rounded-full z-50 ${className}`}
        >
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
                            className="pointer-events-none opacity-50"
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
                    >
                        {content}
                    </Link>
                );
            })}
        </GridContainer>
    );
};