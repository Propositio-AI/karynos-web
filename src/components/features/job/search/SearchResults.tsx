"use client";

import { SearchJobResult } from "@/hooks/features/job/useSearch";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BaseButton } from "@/components/ui/atoms/Button";

type SearchResultsProps = {
    results: SearchJobResult[];
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
    query 
}: SearchResultsProps) => {
    if (!hasSearched) {
        return (
            <div className="text-center py-12 text-slate-500">
                検索キーワードを入力して検索してください
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center py-12 text-slate-500">
                検索中...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500">
                エラーが発生しました: {error}
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                「{query}」に関連する職業が見つかりません
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-slate-600">
                {results.length}件の職業が見つかりました
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((job, index) => (
                    <motion.div
                        key={job.job_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden"
                    >
                        {/* Image */}
                        {job.imgs && job.imgs.length > 0 && (
                            <div className="relative w-full h-48 bg-slate-100 flex items-center justify-center">
                                <Image
                                    src={job.imgs[0]}
                                    alt={job.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            <h3 className="font-semibold text-slate-900 line-clamp-2">
                                {job.name}
                            </h3>

                            <p className="text-sm text-slate-600 line-clamp-2">
                                {job.description}
                            </p>

                            {/* Info badges */}
                            <div className="flex gap-2 flex-wrap">
                                {job.salary && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        {Math.round(job.salary / 10000)}万円
                                    </span>
                                )}
                                {job.age && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                        平均年齢 {job.age}歳
                                    </span>
                                )}
                            </div>

                            {/* Link button */}
                            <Link href={`/job/detail/${job.job_id}`}>
                                <BaseButton
                                    color="blue"
                                    className="w-full text-sm"
                                >
                                    詳細を見る
                                </BaseButton>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
