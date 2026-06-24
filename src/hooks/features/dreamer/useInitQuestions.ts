import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { InitQuestionResponse } from "@/lib/api/gen/schema";

export const useInitQuestions = (version: number = 1) => {
    const [questions, setQuestions] = useState<InitQuestionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await api.getOnboardingQuestionsApiV1OnboardingQuestionsGet({ version });
                setQuestions(result.questions ?? []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "質問取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [version]);

    return { questions, loading, error };
};
