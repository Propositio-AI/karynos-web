"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HorizontalStackContainer, VerticalStackContainer } from "../molecules/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDashboard,
    faUser,
    faUsers,
    faGear,
    faQuestion,
    faBook,
    faChalkboardTeacher,
    faChartBar,
    faFolderOpen,
    faBolt,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type NavItem = {
    label: string;
    icon: IconDefinition;
    href?: string;
    group: string;
};

const navItems: NavItem[] = [
    { label: "ダッシュボード", icon: faDashboard, href: "/mentor/dreamer", group: "メインメニュー" },
    { label: "Dreamer管理", icon: faUser, href: "/mentor/dreamer", group: "メインメニュー" },
    { label: "グループ管理", icon: faUsers, href: "/mentor/dreamer/group", group: "メインメニュー" },
    { label: "クラス管理", icon: faChalkboardTeacher, href: "/mentor/classes", group: "メインメニュー" },
    { label: "クラス全体管理", icon: faChartBar, href: "/mentor/overview", group: "メインメニュー" },
    { label: "授業資料", icon: faFolderOpen, href: "/mentor/materials", group: "授業管理" },
    { label: "Dream Action", icon: faBolt, href: "/mentor/dream-action", group: "授業管理" },
    { label: "設定", icon: faGear, href: undefined, group: "管理機能" },
    { label: "ヘルプ", icon: faQuestion, href: undefined, group: "サポート" },
    { label: "マニュアル", icon: faBook, href: undefined, group: "サポート" },
];

type SideBarButtonProps = {
    item: NavItem;
    isActive: boolean;
};

const SideBarNavItem = ({ item, isActive }: SideBarButtonProps) => {
    const base =
        "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors";
    const active = "bg-blue-500 text-white";
    const inactive = "text-zinc-600 hover:bg-zinc-100 hover:text-blue-500";
    const disabled = "text-zinc-400 cursor-not-allowed opacity-60";

    const inner = (
        <span className={`${base} ${item.href ? (isActive ? active : inactive) : disabled}`}>
            <FontAwesomeIcon icon={item.icon} className="w-4 h-4 shrink-0" />
            {item.label}
        </span>
    );

    if (!item.href) return <div aria-disabled>{inner}</div>;
    return <Link href={item.href}>{inner}</Link>;
};

const groups = ["メインメニュー", "授業管理", "管理機能", "サポート"];

export const SideBar = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isActive = (item: NavItem) => {
        if (!item.href) return false;
        if (item.href === "/mentor/dreamer" && item.label === "ダッシュボード") {
            return pathname === "/mentor/dreamer";
        }
        return pathname.startsWith(item.href);
    };

    return (
        <HorizontalStackContainer space={0} className="min-h-screen items-stretch">
            <VerticalStackContainer space={8} className="w-64 shrink-0 bg-white border-r border-zinc-200 p-4 min-h-screen">
                <div className="px-2 py-3">
                    <h2 className="font-black text-xl text-blue-600">Karynos</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Mentorポータル</p>
                </div>

                {groups.map((group) => {
                    const items = navItems.filter((n) => n.group === group);
                    if (!items.length) return null;
                    return (
                        <VerticalStackContainer key={group} space={1}>
                            <p className="font-semibold text-zinc-400 text-xs px-2 uppercase tracking-wider">
                                {group}
                            </p>
                            {items.map((item) => (
                                <SideBarNavItem key={item.label} item={item} isActive={isActive(item)} />
                            ))}
                        </VerticalStackContainer>
                    );
                })}
            </VerticalStackContainer>

            <div className="flex-1 min-h-screen bg-slate-50 p-8 overflow-y-auto">
                {children}
            </div>
        </HorizontalStackContainer>
    );
};
