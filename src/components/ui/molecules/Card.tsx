import React from "react";
import { HorizontalStackContainer } from "./Container";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
	return (
		<div className={`bg-white rounded-lg border border-slate-200 ${className}`}>
		{children}
		</div>
	);
};

export const DashboardCard = ({title,children, className, icon}: {title: string, children: React.ReactNode, className?: string, icon?: IconDefinition}) => {

    return (
        <HorizontalStackContainer className={`bg-white p-6 ${className} rounded-md`}>
            {icon && (
                <FontAwesomeIcon icon={icon}/>
            )}
            <div>
                <p className="text-zinc-500 my-2">{title}</p>
                <h1>{children}</h1>
            </div>
        </HorizontalStackContainer>
    )
}