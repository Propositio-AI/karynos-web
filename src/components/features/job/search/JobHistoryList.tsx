"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ViewingHistoryItem } from "@/lib/api/gen/schema";
import { BaseButton } from "@/components/ui/atoms/Button";

type JobHistoryListProps = {
	histories: ViewingHistoryItem[];
	isLoading: boolean;
	error: string | null;
};

export const JobHistoryList = ({ histories, isLoading, error }: JobHistoryListProps) => {
	if (isLoading) {
		return (
			<div className="rounded-lg border border-line bg-surface px-6 py-12 text-center text-sm font-bold text-muted shadow-soft">
				読み込み中...
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

	if (!histories || histories.length === 0) {
		return (
			<div className="rounded-lg border border-line bg-surface px-6 py-12 text-center text-sm font-bold text-muted shadow-soft">
				閲覧履歴がありません。
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{histories.map((history, index) => (
				<motion.article
					key={history.history_id}
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.04 }}
					className="overflow-hidden rounded-lg border border-line bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
				>
					{history.job_imgs && history.job_imgs.length > 0 && history.job_imgs[0] && (
						<div className="relative flex aspect-[4/3] w-full items-center justify-center bg-brand-50">
							<Image
								src={history.job_imgs[0]}
								alt={history.job_name}
								fill
								className="object-contain p-3"
								sizes="(max-width: 640px) 100vw, 33vw"
							/>
						</div>
					)}

					<div className="space-y-3 p-4">
						<h3 className="line-clamp-2 text-base font-bold leading-6 text-ink">
							{history.job_name}
						</h3>

						<div className="flex flex-wrap gap-2">
							{history.good && (
								<span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
									いいね
								</span>
							)}
							{history.bad && (
								<span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
									パス
								</span>
							)}
							{history.save && (
								<span className="rounded-full bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-600">
									保存
								</span>
							)}
						</div>

						<p className="text-xs font-bold text-subtle">
							{new Date(history.created_at).toLocaleDateString("ja-JP")}
						</p>

						<Link href={`/job/detail/${history.job_id}`}>
							<BaseButton color="emerald" className="w-full text-sm">
								詳細を見る
							</BaseButton>
						</Link>
					</div>
				</motion.article>
			))}
		</div>
	);
};
