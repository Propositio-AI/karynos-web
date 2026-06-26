import { type ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { HorizontalStackContainer } from "../molecules/Container";
import type { BaseButtonType } from "@/types/ui/atoms/Button";
import type { ColorVariantKey } from "@/types/ui/color";

const buttonClasses: Record<ColorVariantKey, string> = {
    slate: "bg-ink text-white shadow-soft hover:bg-stone-900",
    white: "border border-line bg-surface text-ink shadow-soft hover:border-brand-200 hover:bg-brand-50",
    emerald: "bg-brand-500 text-white shadow-brand hover:bg-brand-600",
    blue: "bg-brand-500 text-white shadow-brand hover:bg-brand-600",
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
            className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${buttonClasses[color]} ${className}`}
            onClick={onClick}
            disabled={isLoading}
            whileHover={isLoading ? undefined : { y: -1 }}
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
            className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-soft transition-colors hover:border-red-200 hover:text-red-400 ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
        >
            <motion.div
                animate={{
                    scale: isFavorite ? [1, 1.2, 1] : 1,
                    rotate: isFavorite ? [0, -5, 5, 0] : 0,
                }}
                transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                }}
            >
                <FiHeart
                    className={`h-5 w-5 transition-colors duration-200 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                />
            </motion.div>

            {isFavorite && (
                <>
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-1 w-1 rounded-full bg-accent-400"
                            initial={{
                                opacity: 0,
                                scale: 0,
                                x: 0,
                                y: 0,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                x: Math.cos((i * Math.PI * 2) / 4) * 16,
                                y: Math.sin((i * Math.PI * 2) / 4) * 16,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: 0.1,
                            }}
                        />
                    ))}
                </>
            )}
        </motion.button>
    );
};

export const NavIcon = ({ icon, label, active }: { icon: IconDefinition; label: string; active: boolean }) => {
    return (
        <div className="mx-auto flex h-16 w-16 flex-col items-center justify-center gap-1 text-center">
            <FontAwesomeIcon
                icon={icon}
                className={`h-4 w-4 rounded-lg p-2 transition duration-200 ${
                    active
                        ? "bg-brand-500 text-white shadow-brand"
                        : "text-subtle hover:bg-brand-50 hover:text-brand-600"
                }`}
            />
            <p className={`text-xs font-bold ${active ? "text-brand-600" : "text-subtle"}`}>
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
            className={`w-full border-none text-sm font-bold ${className} ${active ? "!bg-brand-500 !text-white" : ""}`}
        >
            {children}
        </IconButton>
    );
};
