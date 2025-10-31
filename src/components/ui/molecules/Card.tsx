import React from "react";

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 ${className}`}>
      {children}
    </div>
  );
};

export const MentorDashboardCard = ({title,children, className}: {title: string, children: React.ReactNode, className?: string}) => {

    return (
        <div className={`bg-white p-8 ${className}`}>
            <p className="text-zinc-500 my-2">{title}</p>
            <h1>{children}</h1>
        </div>
    )
}