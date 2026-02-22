'use client';

import React, { useState } from 'react';
import useInitQuestions from '@/hooks/features/match/useMatchQuestions';
import { InitAnswer, InitAnswerRequest } from '@/types/feature/match/match';
import APIcall from '@/lib/api-client/api-call';
import { BaseButton } from '@/components/ui/atoms/Button';

const MATCH_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const MatchQuestions = () => {
    const { questions, loading, error } = useInitQuestions();
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const handleOptionSelect = (questionId: string, optionId: string) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const handleSubmit = async () => {
        const answers: InitAnswer[] = Object.entries(selectedAnswers).map(
            ([questionId, optionId]) => ({
                question_id: questionId,
                option_id: optionId,
                question_version: 1,
            })
        );

        const request: InitAnswerRequest = { answers };

        setSubmitting(true);

        await APIcall<InitAnswerRequest, any>(
            "POST",
            `${MATCH_API_BASE_URL}/dreamer/api/v1/init-answers`,
            { data: request },
            async (result) => {
                console.log("Answers submitted successfully:", result.data);
            },
            async (error) => {
                console.error("Failed to submit answers:", error.message);
            }
        );

        setSubmitting(false);
    };

    if (loading) return <p className="text-center text-gray-600">Loading questions...</p>;
    if (error) return <p className="text-center text-red-600">Error loading questions: {error}</p>;

    const isAnsweredAll = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">職業診断テスト</h1>

            {questions.map((question, index) => (
                <div key={question.question_id} className="mb-8 p-6 border rounded-lg">
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">
                            質問 {index + 1} / {questions.length}
                        </p>
                        <p className="text-sm font-semibold text-gray-600 mb-3">
                            {question.category}
                        </p>
                        <h2 className="text-xl font-bold">{question.question_text}</h2>
                    </div>

                    <div className="space-y-3">
                        {question.options.map((option) => (
                            <button
                                key={option.option_id}
                                onClick={() =>
                                    handleOptionSelect(question.question_id, option.option_id)
                                }
                                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                                    selectedAnswers[question.question_id] === option.option_id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <p className="text-base">{option.option_text}</p>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="mt-8 flex gap-4">
                <BaseButton
                    disabled={!isAnsweredAll || submitting}
                    onClick={handleSubmit}
                    className="flex-1"
                >
                    {submitting ? '送信中...' : '診断結果を見る'}
                </BaseButton>
            </div>
        </div>
    );
};

export default MatchQuestions;