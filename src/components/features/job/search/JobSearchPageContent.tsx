"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useSearch from "@/hooks/features/job/useSearch";
import { useJobHistory } from "@/hooks/features/job/useJobHistory";
import { VerticalStackContainer } from "@/components/ui/molecules/Container";
import { Card } from "@/components/ui/molecules/Card";
import { JobHistoryList } from "@/components/features/job/search/JobHistoryList";
import { SearchResults } from "@/components/features/job/search/SearchResults";
import { BaseButton } from "@/components/ui/atoms/Button";

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
		<div className="min-h-screen bg-slate-50 p-8">
			<VerticalStackContainer space={8} className="max-w-6xl mx-auto">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 mb-2">職業検索</h1>
					<p className="text-slate-600">キーワードで職業を検索</p>
				</div>

				<Card className="p-6">
					<div className="flex gap-3">
						<input
							type="text"
							value={searchKeyword}
							onChange={(e) => setSearchKeyword(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder="人と関わる仕事、創造的な仕事など..."
							className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<BaseButton color="blue" onClick={handleSearch}>
							検索
						</BaseButton>
						{hasSearched && (
							<BaseButton color="white" onClick={handleClear}>
								クリア
							</BaseButton>
						)}
					</div>
				</Card>

				{hasSearched && (
					<div>
						<h2 className="text-2xl font-semibold text-slate-900 mb-4">検索結果</h2>
						<SearchResults
							results={results}
							isLoading={isLoading}
							error={error}
							hasSearched={hasSearched}
							query={searchKeyword}
						/>
					</div>
				)}

				{!hasSearched && (
					<div>
						<h2 className="text-2xl font-semibold text-slate-900 mb-4">閲覧履歴</h2>
						<JobHistoryList
							histories={histories}
							isLoading={historyLoading}
							error={historyError}
						/>
					</div>
				)}
			</VerticalStackContainer>
		</div>
	);
}
