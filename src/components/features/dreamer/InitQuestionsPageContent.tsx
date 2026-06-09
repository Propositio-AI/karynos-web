'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInitQuestions } from '@/hooks/features/dreamer/useInitQuestions';
import { api } from '@/lib/api/client';
import type { SubmitInitAnswerRequest } from '@/lib/api/gen/schema';
import { BaseButton } from '@/components/ui/atoms/Button';

export const InitQuestionsPageContent = () => {
    const router = useRouter();
    const { questions, loading, error } = useInitQuestions();
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleOptionSelect = (questionId: string, optionId: string) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitError(null);

        const answers: SubmitInitAnswerRequest[] = Object.entries(selectedAnswers).map(
            ([questionId, optionId]) => ({
                question_id: questionId,
                option_id: optionId,
                question_version: 1,
            }),
        );

        try {
            await api.submitOnboardingAnswersApiV1OnboardingAnswersPost({ answers });
            router.push('/job/match');
        } catch {
            setSubmitError('回答の送信に失敗しました。もう一度お試しください。');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">読み込み中...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">質問の取得に失敗しました: {error}</p>
            </div>
        );
    }

    const isAnsweredAll =
        questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;

    return (
        <div className="min-h-screen bg-white">
            <div className="w-full max-w-2xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-2">職業診断テスト</h1>
                <p className="text-gray-500 mb-8">
                    以下の質問に答えて、あなたにぴったりの職業を見つけましょう。
                </p>

                {questions.map((question, index) => (
                    <div key={question.question_id} className="mb-8 p-6 border rounded-lg">
                        <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-1">
                                質問 {index + 1} / {questions.length}
                            </p>
                            <p className="text-sm font-semibold text-gray-500 mb-3">
                                {question.category}
                            </p>
                            <h2 className="text-xl font-bold">{question.question_text}</h2>
                        </div>

                        <div className="space-y-3">
                            {(question.options ?? []).map((option) => (
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

                {submitError && (
                    <p className="text-red-600 text-sm mb-4">{submitError}</p>
                )}

                <div className="mt-8">
                    <BaseButton
                        isLoading={!isAnsweredAll || submitting}
                        onClick={handleSubmit}
                        className="w-full"
                    >
                        {submitting ? '送信中...' : '診断結果を見る'}
                    </BaseButton>
                </div>
            </div>
        </div>
    );
};
