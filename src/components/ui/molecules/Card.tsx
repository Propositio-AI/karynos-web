import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { HorizontalStackContainer } from "./Container";

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`rounded-(--radius-md) border border-line bg-surface ${className}`}>
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
        <HorizontalStackContainer
            space={4}
            className={`rounded-(--radius-md) border border-line bg-surface p-6 ${className}`}
        >
            {icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-(--radius-sm) bg-brand-50">
                    <FontAwesomeIcon icon={icon} className="h-4 w-4 text-brand-700" />
                </div>
            )}
            <div>
                <p className="text-sm font-medium text-muted">{title}</p>
                <h1 className="mt-1">{children}</h1>
            </div>
        </HorizontalStackContainer>
    );
};
