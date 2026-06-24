import { type ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { HorizontalStackContainer } from "../molecules/Container";
import type { BaseButtonType } from "@/types/ui/atoms/Button";
import type { ColorVariantKey } from "@/types/ui/color";

const buttonClasses: Record<ColorVariantKey, string> = {
    slate: "bg-ink text-white hover:bg-stone-800",
    white: "border border-line bg-surface text-ink hover:bg-canvas hover:border-subtle/60",
    emerald: "bg-brand-700 text-white hover:bg-brand-800",
    blue: "bg-brand-700 text-white hover:bg-brand-800",
};

const spinnerClasses: Record<ColorVariantKey, string> = {
    slate: "border-white",
    white: "border-ink",
    emerald: "border-white",
    blue: "border-white",
};

export const BaseButton = ({
    color = "white",
    children,
    className = "",
    isLoading = false,
    onClick,
}: BaseButtonType) => {
    return (
        <motion.button
            className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-(--radius-sm) px-4 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${buttonClasses[color]} ${className}`}
            onClick={onClick}
            disabled={isLoading}
            whileTap={isLoading ? undefined : { scale: 0.98 }}
        >
            {isLoading ? (
                <motion.div
                    className={`mx-auto h-4 w-4 rounded-full border-2 border-t-transparent ${spinnerClasses[color]}`}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
            ) : (
                <span className="w-full text-center">
                    {children}
                </span>
            )}
        </motion.button>
    );
};

export const IconButton = ({
    color = "white",
    children,
    className = "",
    isLoading,
    onClick,
    icon,
}: BaseButtonType & { icon?: IconDefinition | ReactNode }) => {
    const isIconDefinition = (i: unknown): i is IconDefinition => {
        return !!i && typeof i === "object" && "prefix" in i && "iconName" in i && "icon" in i;
    };

    return (
        <BaseButton color={color} className={className} isLoading={isLoading} onClick={onClick}>
            <HorizontalStackContainer space={2} className="mx-auto justify-center">
                {isIconDefinition(icon)
                    ? <FontAwesomeIcon icon={icon} className="h-4 w-4" />
                    : icon}
                {children}
            </HorizontalStackContainer>
        </BaseButton>
    );
};

type FavoriteButtonType = {
    className?: string;
    onToggle?: (isFavorite: boolean) => void;
};

export const FavoriteButton = ({ className = "", onToggle }: FavoriteButtonType) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleClick = () => {
        const newState = !isFavorite;
        setIsFavorite(newState);
        onToggle?.(newState);
    };

    return (
        <motion.button
            onClick={handleClick}
            className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-red-200 hover:text-red-400 ${className}`}
            whileTap={{ scale: 0.92 }}
        >
            <FiHeart
                className={`h-4.5 w-4.5 transition-colors duration-150 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
        </motion.button>
    );
};

export const NavIcon = ({ icon, label, active }: { icon: IconDefinition; label: string; active: boolean }) => {
    return (
        <div className="mx-auto flex h-14 w-16 flex-col items-center justify-center gap-1 text-center">
            <FontAwesomeIcon
                icon={icon}
                className={`h-[18px] w-[18px] transition-colors duration-150 ${
                    active ? "text-brand-700" : "text-subtle"
                }`}
            />
            <p className={`text-[11px] font-semibold ${active ? "text-brand-700" : "text-subtle"}`}>
                {label}
            </p>
        </div>
    );
};

export const SideBarButton = ({
    color = "white",
    children,
    className = "",
    isLoading,
    onClick,
    icon,
    active = false,
}: BaseButtonType & { icon: IconDefinition; active: boolean }) => {
    return (
        <IconButton
            color={color}
            icon={icon}
            onClick={onClick}
            isLoading={isLoading}
            className={`w-full justify-start border-none text-sm font-semibold ${className} ${active ? "bg-brand-50! text-brand-700!" : "bg-transparent! text-muted! hover:bg-canvas!"}`}
        >
            {children}
        </IconButton>
    );
};
