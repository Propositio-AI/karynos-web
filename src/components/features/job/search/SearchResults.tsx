"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { JobSearchResult } from "@/lib/api/gen/schema";
import { BaseButton } from "@/components/ui/atoms/Button";

type SearchResultsProps = {
    results: JobSearchResult[];
    isLoading: boolean;
    error: string | null;
    hasSearched: boolean;
    query?: string;
};

export const SearchResults = ({
    results,
    isLoading,
    error,
    hasSearched,
    query,
}: SearchResultsProps) => {
    if (!hasSearched) {
        return (
            <div className="rounded-lg border border-line bg-surface px-6 py-12 text-center text-sm font-bold text-muted shadow-soft">
                検索キーワードを入力してください。
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="rounded-lg border border-line bg-surface px-6 py-12 text-center text-sm font-bold text-muted shadow-soft">
                検索中...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center text-sm font-bold text-red-600 shadow-soft">
                エラーが発生しました: {error}
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="rounded-lg border border-line bg-surface px-6 py-12 text-center text-sm font-bold text-muted shadow-soft">
                「{query}」に関連する職業が見つかりませんでした。
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-sm font-bold text-muted">
                {results.length}件の職業が見つかりました
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((job, index) => (
                    <motion.article
                        key={job.job_id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="overflow-hidden rounded-lg border border-line bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
                    >
                        {job.imgs && job.imgs.length > 0 && job.imgs[0] && (
                            <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-brand-50">
                                <Image
                                    src={job.imgs[0]}
                                    alt={job.name}
                                    fill
                                    className="object-contain p-3"
                                    sizes="(max-width: 640px) 100vw, 33vw"
                                />
                            </div>
                        )}

                        <div className="space-y-3 p-4">
                            <h3 className="line-clamp-2 text-base font-bold leading-6 text-ink">
                                {job.name}
                            </h3>

                            <p className="line-clamp-3 text-sm leading-6 text-muted">
                                {job.description || "説明はまだありません。"}
                            </p>

                            <Link href={`/job/detail/${job.job_id}`}>
                                <BaseButton color="emerald" className="w-full text-sm">
                                    詳細を見る
                                </BaseButton>
                            </Link>
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
};
