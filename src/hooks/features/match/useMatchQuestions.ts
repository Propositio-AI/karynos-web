import { useEffect, useState } from 'react';
import APIcall from '@/lib/api-client/api-call';
import { InitQuestionsResponse, InitQuestion } from '@/types/feature/match/match';

const MATCH_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const useInitQuestions = (version: number = 1) => {
    const [questions, setQuestions] = useState<InitQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            setError(null);

            console.log(`${MATCH_API_BASE_URL}/api/v1/init-questions?version=${version}`,)

            await APIcall<null, InitQuestionsResponse>(
                "GET",
                `${MATCH_API_BASE_URL}/dreamer/api/v1/init-questions?version=${version}`,
                undefined,
                async (result) => { 

                    console.log(result)
                    setQuestions(result.data.questions);
                },
                async (error) => {
                    setError(error.message.join(', '));
                }
            );

            setLoading(false);
        };

        fetchQuestions();
    }, [version]);


    return { questions, loading, error };
};

export default useInitQuestions;