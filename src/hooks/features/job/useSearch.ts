import { useState } from "react";
import APIcall from "@/lib/api-client/api-call";

export interface SearchJobResult {
    job_id: number;
    name: string;
    description: string;
    imgs: string[];
    salary: number;
    age: number;
    [key: string]: any;
}

interface SearchResponse {
    items: SearchJobResult[];
    total_count: number;
}

const useSearch = () => {
    const [results, setResults] = useState<SearchJobResult[]>([]);
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
            await APIcall(
                "GET",
                `/job/api/v1/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=0`,
                undefined,
                async (response: any) => {
                    if (response?.data && Array.isArray(response.data.items)) {
                        setResults(response.data.items);
                    } else if (response?.data && Array.isArray(response.data)) {
                        setResults(response.data);
                    }
                    setIsLoading(false);
                },
                async (error: any) => {
                    setError(error?.message?.[0] || "検索に失敗しました");
                    setResults([]);
                    setIsLoading(false);
                }
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "検索に失敗しました";
            setError(errorMessage);
            setResults([]);
            setIsLoading(false);
        }
    };

    const clearResults = () => {
        setResults([]);
        setHasSearched(false);
        setError(null);
    };

    return {
        results,
        isLoading,
        error,
        hasSearched,
        search,
        clearResults,
    };
};

export default useSearch;