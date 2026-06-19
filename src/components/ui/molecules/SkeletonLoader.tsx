export const SkeletonText = ({ className = "" }: { className?: string }) => (
    <div className={`h-4 bg-zinc-200 rounded animate-pulse ${className}`} />
);

export const SkeletonCard = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white border border-zinc-200 rounded-lg p-6 animate-pulse ${className}`}>
        <div className="h-4 bg-zinc-200 rounded w-1/3 mb-3" />
        <div className="h-8 bg-zinc-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-zinc-200 rounded w-2/3" />
    </div>
);

export const SkeletonRow = ({ cols = 4, className = "" }: { cols?: number; className?: string }) => (
    <tr className={`animate-pulse ${className}`}>
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className="p-4">
                <div className="h-4 bg-zinc-200 rounded w-full" />
            </td>
        ))}
    </tr>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
    <tbody>
        {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} cols={cols} />
        ))}
    </tbody>
);
