import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import type { ViewingHistoryItem } from '@/lib/api/gen/schema';

export const useJobHistory = () => {
    const [histories, setHistories] = useState<ViewingHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async (limit = 50, offset = 0) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getViewingHistoryApiV1JobHistoryGet({ limit, offset });
            setHistories(response.items ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : '履歴の取得に失敗しました');
            setHistories([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return { histories, isLoading, error, refetch: fetchHistory };
};
