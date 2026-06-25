import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, useTransform } from "framer-motion";
import { api } from "@/lib/api/client";
import type { JobRecommendation, RecommendResponse } from "@/types/api/job";
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

type SwipeDirection = "center" | "left" | "right";
type SwipeEventDirection = "good" | "bad" | "save";

export const useJobMatch = () => {
    const [expanded, setExpanded] = useState(false);
    const [imageFullscreen, setImageFullscreen] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>("center");
    const [currentJob, setCurrentJob] = useState<JobRecommendation | null>(null);
    const [cardIndex, setCardIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const cardIndexRef = useRef(0);
    const lastSwipeAtRef = useRef<number | null>(null);
    const shownJobKeysRef = useRef<Set<string>>(new Set());

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-20, 20]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 0.8, 1, 0.8, 0]);

    const fetchRecommendations = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const timeoutId = window.setTimeout(() => {
            setError("APIの応答が遅れています。もう一度読み込み直してください。");
            setIsLoading(false);
        }, 10000);

        try {
            const response = await api.recommendJobsApiV1MatchingRecommendGet();
            // NOTE: OpenAPI spec (TopRecommendedJobMatch) does not match actual response shape.
            const payload = response as unknown as RecommendResponse;
            setCurrentJob(payload?.recommendation ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "おすすめ取得に失敗しました。");
        } finally {
            window.clearTimeout(timeoutId);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    useEffect(() => {
        if (!currentJob) {
            return;
        }

        const key = `${currentJob.history_id}:${cardIndex}`;
        if (shownJobKeysRef.current.has(key)) {
            return;
        }

        shownJobKeysRef.current.add(key);
        captureAnalyticsEvent("job_card_shown", {
            job_id: currentJob.job_id,
            history_id: currentJob.history_id,
            similarity_score: currentJob.similarity_score,
            card_index: cardIndex,
        });
    }, [cardIndex, currentJob]);

    const markAsGood = useCallback(async (targetId: string) => {
        try {
            await api.markGoodApiV1JobGoodHistoryIdPut(encodeURIComponent(targetId));
        } catch (err) {
            console.error("Failed to mark as good:", err);
        }
    }, []);

    const markAsBad = useCallback(async (targetId: string) => {
        try {
            await api.markBadApiV1JobBadHistoryIdPut(encodeURIComponent(targetId));
        } catch (err) {
            console.error("Failed to mark as bad:", err);
        }
    }, []);

    const markAsSave = useCallback(async (targetId: string) => {
        try {
            await api.markSaveApiV1JobSaveHistoryIdPut(encodeURIComponent(targetId));
        } catch (err) {
            console.error("Failed to mark as save:", err);
        }
    }, []);

    const resetSwipe = useCallback(() => {
        x.set(0);
        setSwipeDirection("center");
        setExpanded(false);
        setImageFullscreen(false);
    }, [x]);

    const advanceCard = useCallback(() => {
        cardIndexRef.current += 1;
        setCardIndex(cardIndexRef.current);
        fetchRecommendations();
        resetSwipe();
    }, [fetchRecommendations, resetSwipe]);

    const captureSwipe = useCallback(
        (direction: SwipeEventDirection, job: JobRecommendation) => {
            const now = Date.now();
            const timeSinceLastSwipe =
                lastSwipeAtRef.current === null
                    ? null
                    : now - lastSwipeAtRef.current;

            lastSwipeAtRef.current = now;
            captureAnalyticsEvent("job_card_swiped", {
                job_id: job.job_id,
                history_id: job.history_id,
                direction,
                card_index: cardIndexRef.current,
                time_since_last_swipe_ms: timeSinceLastSwipe,
            });
        },
        [],
    );

    const handleDragEndMain = useCallback(
        (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
            const threshold = 180;
            const velocityThreshold = 500;

            if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                setSwipeDirection("right");
                if (currentJob) {
                    captureSwipe("good", currentJob);
                    markAsGood(currentJob.history_id);
                    advanceCard();
                }
            } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                setSwipeDirection("left");
                if (currentJob) {
                    captureSwipe("bad", currentJob);
                    markAsBad(currentJob.history_id);
                    advanceCard();
                }
            } else {
                setSwipeDirection("center");
            }
        },
        [advanceCard, captureSwipe, currentJob, markAsBad, markAsGood],
    );

    const handleImageDragEnd = (_: unknown, info: { offset: { y: number } }) => {
        if (info.offset.y < -50) {
            setImageFullscreen(true);
            setExpanded(false);
        } else if (info.offset.y > 50) {
            setImageFullscreen(false);
        }
    };

    const handleDetailDragEnd = (_: unknown, info: { offset: { y: number } }) => {
        if (info.offset.y < -50) setExpanded(true);
        if (info.offset.y > 50) setExpanded(false);
    };

    const handleSave = useCallback(() => {
        if (!currentJob) {
            return;
        }

        captureSwipe("save", currentJob);
        markAsSave(currentJob.history_id);
        advanceCard();
    }, [advanceCard, captureSwipe, currentJob, markAsSave]);

    const handleLike = useCallback(() => {
        if (!currentJob) {
            return;
        }

        setSwipeDirection("right");
        captureSwipe("good", currentJob);
        markAsGood(currentJob.history_id);
        advanceCard();
    }, [advanceCard, captureSwipe, currentJob, markAsGood]);

    const handlePass = useCallback(() => {
        if (!currentJob) {
            return;
        }

        setSwipeDirection("left");
        captureSwipe("bad", currentJob);
        markAsBad(currentJob.history_id);
        advanceCard();
    }, [advanceCard, captureSwipe, currentJob, markAsBad]);

    const toggleExpanded = useCallback(() => {
        setExpanded((prev) => !prev);
    }, []);

    const customDirection = swipeDirection === "right" ? 1 : -1;

    return {
        expanded,
        imageFullscreen,
        swipeDirection,
        x,
        rotate,
        opacity,
        customDirection,
        handleDragEndMain,
        handleImageDragEnd,
        handleDetailDragEnd,
        resetSwipe,
        handleSave,
        handleLike,
        handlePass,
        toggleExpanded,
        currentJob,
        cardIndex,
        isLoading,
        error,
        fetchRecommendations,
        markAsGood,
        markAsBad,
        markAsSave,
    };
};
