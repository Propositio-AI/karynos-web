import { useState, useEffect, useCallback } from 'react';
import { useMotionValue, useTransform } from 'framer-motion';
import { api } from '@/lib/api/client';
import type { RecommendResponse, JobRecommendation } from '@/types/api/job';

type SwipeDirection = 'center' | 'left' | 'right';

export const useJobMatch = () => {
    const [expanded, setExpanded] = useState(false);
    const [imageFullscreen, setImageFullscreen] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>('center');
    const [currentJob, setCurrentJob] = useState<JobRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-20, 20]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 0.8, 1, 0.8, 0]);

    const fetchRecommendations = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const timeoutId = setTimeout(() => {
            setError('APIの応答が遅延しています。再読み込みしてください。');
            setIsLoading(false);
        }, 10000);

        try {
            const response = await api.recommendJobsApiV1MatchingRecommendGet();
            console.log('API response:', response);
            // NOTE: OpenAPI spec (TopRecommendedJobMatch) doesn't match actual response shape.
            // Using manual RecommendResponse type until the spec is updated.
            const payload = response as unknown as RecommendResponse;
            setCurrentJob(payload?.recommendation ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'おすすめ取得に失敗しました');
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    const markAsGood = useCallback(async (targetId: string) => {
        try {
            await api.markGoodApiV1JobGoodHistoryIdPut(encodeURIComponent(targetId));
        } catch (err) {
            console.error('Failed to mark as good:', err);
        }
    }, []);

    const markAsBad = useCallback(async (targetId: string) => {
        try {
            await api.markBadApiV1JobBadHistoryIdPut(encodeURIComponent(targetId));
        } catch (err) {
            console.error('Failed to mark as bad:', err);
        }
    }, []);

    const markAsSave = useCallback(async (targetId: string) => {
        try {
            await api.markSaveApiV1JobSaveHistoryIdPut(encodeURIComponent(targetId));
        } catch (err) {
            console.error('Failed to mark as save:', err);
        }
    }, []);

    const resetSwipe = () => {
        x.set(0);
        setSwipeDirection('center');
        setExpanded(false);
        setImageFullscreen(false);
    };

    const handleDragEndMain = useCallback(
        (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
            const threshold = 180;
            const velocityThreshold = 500;

            if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                setSwipeDirection('right');
                if (currentJob) {
                    markAsGood(currentJob.history_id);
                    fetchRecommendations();
                    resetSwipe();
                }
            } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                setSwipeDirection('left');
                if (currentJob) {
                    markAsBad(currentJob.history_id);
                    fetchRecommendations();
                    resetSwipe();
                }
            } else {
                setSwipeDirection('center');
            }
        },
        [currentJob, fetchRecommendations, markAsGood, markAsBad],
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
        if (currentJob) markAsSave(currentJob.history_id);
    }, [currentJob, markAsSave]);

    const customDirection = swipeDirection === 'right' ? 1 : -1;

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
        currentJob,
        isLoading,
        error,
        fetchRecommendations,
        markAsGood,
        markAsBad,
        markAsSave,
    };
};
