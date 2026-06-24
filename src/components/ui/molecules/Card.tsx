import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { HorizontalStackContainer } from "./Container";

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`rounded-lg border border-line bg-surface shadow-soft ${className}`}>
            {children}
        </div>
    );
};

export const DashboardCard = ({
    title,
    children,
    className = "",
    icon,
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
    icon?: IconDefinition;
}) => {
    return (
        <HorizontalStackContainer className={`rounded-lg border border-line bg-surface p-6 shadow-soft ${className}`}>
            {icon && (
                <FontAwesomeIcon icon={icon} className="h-5 w-5 text-brand-500" />
            )}
            <div>
                <p className="my-2 text-sm font-bold text-muted">{title}</p>
                <h1>{children}</h1>
            </div>
        </HorizontalStackContainer>
    );
};
