"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSearch from "@/hooks/features/job/useSearch";
import { useJobHistory } from "@/hooks/features/job/useJobHistory";
import { BaseButton } from "@/components/ui/atoms/Button";
import { Card } from "@/components/ui/molecules/Card";
import { JobHistoryList } from "@/components/features/job/search/JobHistoryList";
import { SearchResults } from "@/components/features/job/search/SearchResults";

export default function JobSearchPageContent() {
	const searchParams = useSearchParams();
	const initialQuery = searchParams.get("q") || "";
	const [searchKeyword, setSearchKeyword] = useState(initialQuery);
	const { search, results, isLoading, error, hasSearched, clearResults } = useSearch();
	const { histories, isLoading: historyLoading, error: historyError } = useJobHistory();

	useEffect(() => {
		if (initialQuery) {
			search(initialQuery);
		}
	}, [initialQuery, search]);

	const handleSearch = () => {
		if (searchKeyword.trim()) {
			search(searchKeyword);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleClear = () => {
		setSearchKeyword("");
		clearResults();
	};

	return (
		<main className="min-h-screen bg-canvas px-4 pb-28 pt-6 sm:px-6 sm:pt-10">
			<div className="mx-auto w-full max-w-5xl">
				<section className="mb-8">
					<p className="mb-2 text-sm font-semibold text-brand-700">Explore</p>
					<h1 className="text-2xl text-ink sm:text-3xl">職業を探す</h1>
					<p className="mt-3 text-sm leading-7 text-muted">
						気になる言葉から、まだ知らない仕事を見つけます。
					</p>
				</section>

				<Card className="mb-8 p-4 sm:p-5">
					<div className="flex flex-col gap-3 sm:flex-row">
						<input
							type="text"
							value={searchKeyword}
							onChange={(e) => setSearchKeyword(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder="人と関わる仕事、ものづくり、自然、医療..."
							className="min-h-12 flex-1 rounded-(--radius-sm) border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-subtle focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
						/>
						<div className="grid grid-cols-2 gap-3 sm:flex">
							<BaseButton
								color="emerald"
								className="w-full sm:w-auto"
								onClick={handleSearch}
							>
								検索
							</BaseButton>
							{hasSearched && (
								<BaseButton
									color="white"
									className="w-full sm:w-auto"
									onClick={handleClear}
								>
									クリア
								</BaseButton>
							)}
						</div>
					</div>
				</Card>

				{hasSearched ? (
					<section>
						<div className="mb-4 flex items-end justify-between gap-3">
							<div>
								<h2 className="text-lg text-ink">検索結果</h2>
								<p className="mt-1 text-xs font-medium text-subtle">
									{searchKeyword}
								</p>
							</div>
						</div>
						<SearchResults
							results={results}
							isLoading={isLoading}
							error={error}
							hasSearched={hasSearched}
							query={searchKeyword}
						/>
					</section>
				) : (
					<section>
						<h2 className="mb-4 text-lg text-ink">閲覧履歴</h2>
						<JobHistoryList
							histories={histories}
							isLoading={historyLoading}
							error={historyError}
						/>
					</section>
				)}
			</div>
		</main>
	);
}
