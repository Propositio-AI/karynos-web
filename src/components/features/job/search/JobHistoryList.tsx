"use client";

import type { ViewingHistoryItem } from "@/lib/api/gen/schema";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BaseButton } from "@/components/ui/atoms/Button";

type JobHistoryListProps = {
    histories: ViewingHistoryItem[];
    isLoading: boolean;
    error: string | null;
};

export const JobHistoryList = ({ histories, isLoading, error }: JobHistoryListProps) => {
    if (isLoading) {
        return (
            <div className="text-center py-12 text-slate-500">
                読み込み中...
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

    if (!histories || histories.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                閲覧履歴がありません
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {histories.map((history, index) => (
                <motion.div
                    key={history.history_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden"
                >
                    {/* Image */}
                    {history.job_imgs && history.job_imgs.length > 0 && history.job_imgs[0] && (
                        <div className="relative w-full h-48 bg-slate-100 flex items-center justify-center">
                            <Image
                                src={history.job_imgs[0]}
                                alt={history.job_name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-slate-900 line-clamp-2">
                            {history.job_name}
                        </h3>

                        {/* Status badges */}
                        <div className="flex gap-2 flex-wrap">
                            {history.good && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    👍 いいね
                                </span>
                            )}
                            {history.bad && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                    ❌ パス
                                </span>
                            )}
                            {history.save && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    💾 保存
                                </span>
                            )}
                        </div>

                        {/* Date */}
                        <p className="text-xs text-slate-500">
                            {new Date(history.created_at).toLocaleDateString("ja-JP")}
                        </p>

                        {/* Link button */}
                        <Link href={`/job/detail/${history.job_id}`}>
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
    );
};
