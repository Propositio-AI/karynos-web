"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInitQuestions } from "@/hooks/features/dreamer/useInitQuestions";
import { api } from "@/lib/api/client";
import { isCognitoConfigured } from "@/lib/auth/amplify";
import { markLocalOnboardingAnswered } from "@/lib/onboarding/localStatus";
import type { InitQuestionResponse, SubmitInitAnswerRequest } from "@/lib/api/gen/schema";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

const ONBOARDING_VERSION = 1;

const getHttpStatus = (error: unknown) => {
    if (typeof error !== "object" || error === null || !("response" in error)) {
        return undefined;
    }

    return (error as { response?: { status?: number } }).response?.status;
};

export const InitQuestionsPageContent = () => {
    const router = useRouter();
    const { questions, loading, error } = useInitQuestions();
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const shownQuestionKeys = useRef<Set<string>>(new Set());

    const orderedQuestions = useMemo(() => {
        return [...questions].sort((a, b) => a.question_order - b.question_order);
    }, [questions]);

    useEffect(() => {
        orderedQuestions.forEach((question) => {
            const key = `${question.version}:${question.question_id}`;
            if (shownQuestionKeys.current.has(key)) {
                return;
            }

            shownQuestionKeys.current.add(key);
            captureAnalyticsEvent("question_shown", {
                question_id: question.question_id,
                question_order: question.question_order,
                version: question.version,
            });
        });
    }, [orderedQuestions]);

    const handleOptionSelect = (
        question: InitQuestionResponse,
        optionId: string,
    ) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [question.question_id]: optionId,
        }));
        captureAnalyticsEvent("question_answered", {
            question_id: question.question_id,
            question_order: question.question_order,
            version: question.version,
            option_id: optionId,
        });
    };

    const handleSubmit = async () => {
        const isAnsweredAll =
            orderedQuestions.length > 0 &&
            Object.keys(selectedAnswers).length === orderedQuestions.length;

        if (!isAnsweredAll || submitting) {
            return;
        }

        setSubmitting(true);
        setSubmitError(null);

        const answers: SubmitInitAnswerRequest[] = orderedQuestions.map((question) => ({
            question_id: question.question_id,
            option_id: selectedAnswers[question.question_id] as string,
            question_version: question.version,
        }));

        try {
            await api.submitOnboardingAnswersApiV1OnboardingAnswersPost({ answers });
            markLocalOnboardingAnswered(ONBOARDING_VERSION);
            router.push("/job/match");
        } catch (err) {
            if (!isCognitoConfigured() && getHttpStatus(err) === 404) {
                markLocalOnboardingAnswered(ONBOARDING_VERSION);
                router.push("/job/match");
                return;
            }

            setSubmitError("回答の送信に失敗しました。もう一度お試しください。");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
                <p className="rounded-(--radius-sm) border border-line bg-surface px-6 py-5 text-sm font-semibold text-muted">
                    読み込み中...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
                <p className="rounded-(--radius-sm) border border-red-200 bg-red-50 px-6 py-5 text-sm font-semibold text-red-600">
                    質問の取得に失敗しました: {error}
                </p>
            </div>
        );
    }

    const answeredCount = Object.keys(selectedAnswers).length;
    const isAnsweredAll =
        orderedQuestions.length > 0 &&
        answeredCount === orderedQuestions.length;
    const progressPercent = orderedQuestions.length > 0
        ? Math.round((answeredCount / orderedQuestions.length) * 100)
        : 0;

    return (
        <main className="min-h-screen bg-canvas px-4 pb-48 pt-6 sm:px-6 sm:pt-10">
            <div className="mx-auto w-full max-w-2xl">
                <section className="mb-6 rounded-(--radius-md) border border-line bg-surface p-5 sm:p-7">
                    <p className="mb-2 text-sm font-semibold text-brand-700">
                        First match setup
                    </p>
                    <h1 className="text-2xl text-ink sm:text-3xl">
                        初期診断
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-muted">
                        直感に近い選択肢を選んでください。回答をもとに、最初のおすすめ職業を並べます。
                    </p>
                    <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted">
                            <span>{answeredCount} / {orderedQuestions.length}</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-line">
                            <div
                                className="h-full rounded-full bg-brand-500 transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </section>

                <div className="space-y-4">
                    {orderedQuestions.map((question, index) => (
                        <section
                            key={question.question_id}
                            className="rounded-(--radius-md) border border-line bg-surface p-5 sm:p-6"
                        >
                            <div className="mb-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-600">
                                        Q{index + 1}
                                    </p>
                                    <p className="text-xs font-medium text-subtle">
                                        {question.category}
                                    </p>
                                </div>
                                <h2 className="text-lg leading-7 text-ink">
                                    {question.question_text}
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {(question.options ?? []).map((option) => {
                                    const selected = selectedAnswers[question.question_id] === option.option_id;

                                    return (
                                        <button
                                            key={option.option_id}
                                            onClick={() => handleOptionSelect(question, option.option_id)}
                                            className={`w-full rounded-(--radius-sm) border px-4 py-4 text-left text-sm font-medium leading-6 transition-colors ${
                                                selected
                                                    ? "border-brand-600 bg-brand-50 text-brand-900"
                                                    : "border-line bg-white text-ink hover:border-brand-200 hover:bg-brand-50/60"
                                            }`}
                                        >
                                            {option.option_text}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>

                {submitError && (
                    <p className="mt-4 rounded-(--radius-sm) border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                        {submitError}
                    </p>
                )}
            </div>

            <div className="fixed inset-x-0 bottom-16 z-40 border-t border-line bg-surface/95 px-4 py-4 backdrop-blur">
                <div className="mx-auto max-w-2xl">
                    <button
                        disabled={!isAnsweredAll || submitting}
                        onClick={handleSubmit}
                        className="min-h-12 w-full rounded-(--radius-sm) bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-line disabled:text-subtle"
                    >
                        {submitting ? "送信中..." : "診断結果を見る"}
                    </button>
                </div>
            </div>
        </main>
    );
};
