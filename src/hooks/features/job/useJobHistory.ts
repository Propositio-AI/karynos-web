import { useState, useEffect } from "react";
import APIcall from "@/lib/api-client/api-call";

export interface JobHistory {
    history_id: string;
    job_id: number;
    job_name: string;
    job_imgs: string[];
    good: boolean;
    bad: boolean;
    save: boolean;
    created_at: string;
}

interface HistoryResponse {
    total_count: number;
    items: JobHistory[];
    created_at: string;
}

export const useJobHistory = () => {
    const [histories, setHistories] = useState<JobHistory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async (limit = 50, offset = 0) => {
        setIsLoading(true);
        setError(null);
        try {
            await APIcall<null, HistoryResponse>(
                "GET",
                `http://localhost:8080/job/api/v1/history?limit=${limit}&offset=${offset}`,
                undefined,
                async (response) => {
                    setHistories(response.data.items || []);
                },
                async (error) => {
                    setError(error.message.join(", "));
                    setHistories([]);
                }
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return {
        histories,
        isLoading,
        error,
        refetch: fetchHistory,
    };
};
