import Link from "next/link";
import type { TagColor } from "@/types/ui/atoms/Text";

type TagProps = {
    text: string;
    color: TagColor;
    href?: string;
    onClick?: () => void;
};

const colorClassMap: Record<TagColor, string> = {
    slate: "border-line bg-canvas text-ink hover:bg-line/60",
    red: "border-red-100 bg-red-50 text-red-700 hover:bg-red-100",
    orange: "border-accent-100 bg-accent-50 text-accent-600 hover:bg-accent-100",
    yellow: "border-accent-100 bg-accent-50 text-accent-600 hover:bg-accent-100",
    green: "border-brand-100 bg-brand-50 text-brand-700 hover:bg-brand-100",
    blue: "border-brand-100 bg-brand-50 text-brand-700 hover:bg-brand-100",
    purple: "border-line bg-canvas text-muted hover:bg-line/60",
};

export const Tag = ({ text, color, href, onClick }: TagProps) => {
    const tagElement = (
        <div className={`m-1 inline-flex cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${colorClassMap[color]}`}>
            {text}
        </div>
    );

    if (href) return <Link href={href}>{tagElement}</Link>;
    if (onClick) return <div onClick={onClick}>{tagElement}</div>;
    return tagElement;
};

type BreadCrumbLink = {
    name: string;
    link: string;
};

type BreadCrumbProps = {
    links: BreadCrumbLink[];
};

export const BreadCrumb = ({ links }: BreadCrumbProps) => {
    return (
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted">
            {links.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                    {index > 0 && <span>/</span>}
                    {item.link ? (
                        <Link href={item.link} className="transition-colors hover:text-ink">
                            {item.name}
                        </Link>
                    ) : (
                        <span className="font-bold text-ink">{item.name}</span>
                    )}
                </span>
            ))}
        </nav>
    );
};
