import { useState } from "react";
import { api } from "@/lib/api/client";
import type { JobSearchResult } from "@/lib/api/gen/schema";

const useSearch = () => {
	const [results, setResults] = useState<JobSearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasSearched, setHasSearched] = useState(false);

	const search = async (query: string, limit: number = 20) => {
		if (!query.trim()) {
			setResults([]);
			setHasSearched(true);
			return;
		}

		setIsLoading(true);
		setError(null);
		setHasSearched(true);

		try {
			const response = await api.searchJobsApiV1JobSearchGet({ q: query, limit, offset: 0 });
			setResults(response.items ?? []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "検索に失敗しました");
			setResults([]);
		} finally {
			setIsLoading(false);
		}
	};

	const clearResults = () => {
		setResults([]);
		setHasSearched(false);
		setError(null);
	};

	return { results, isLoading, error, hasSearched, search, clearResults };
};

export default useSearch;
