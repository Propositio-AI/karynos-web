import { useState, useEffect, useCallback } from "react";
import { useMotionValue, useTransform } from "framer-motion";
import APIcall from "@/lib/api-client/api-call";
import { RecommendResponse, JobRecommendation } from "@/types/api/job";

type SwipeDirection = "center" | "left" | "right";

export const useJobMatch = () => {
    const [expanded, setExpanded] = useState(false);
    const [imageFullscreen, setImageFullscreen] = useState(false);
    const [swipeDirection, setSwipeDirection] =
        useState<SwipeDirection>("center");
    const [currentJob, setCurrentJob] = useState<JobRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-20, 20]);
    const opacity = useTransform(
        x,
        [-200, -150, 0, 150, 200],
        [0, 0.8, 1, 0.8, 0]
    );

    // おすすめジョブを取得
    const fetchRecommendations = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const timeoutId = setTimeout(() => {
            setError("APIの応答が遅延しています。再読み込みしてください。");
            setIsLoading(false);
        }, 10000);

        await APIcall<void, RecommendResponse>(
            "GET",
            "/job/api/v1/recommend",
            undefined,
            async (response) => {
                clearTimeout(timeoutId);
                if (response.success && response.data) {
                    const payload: any = response.data as any;
                    const actualData =
                        payload?.recommendation ? payload : payload?.data;

                    setCurrentJob(actualData?.recommendation || null);
                } else {
                    setCurrentJob(null);
                }
                setIsLoading(false);
            },
            async (errorResponse) => {
                clearTimeout(timeoutId);
                setError(errorResponse.message.join(", "));
                setIsLoading(false);
            }
        );
    }, []);

    // 初回ロード時にデータ取得
    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    // 「いいね」を登録
    const markAsGood = useCallback(async (targetId: string) => {
        await APIcall<void, string>(
            "PUT",
            `/job/api/v1/good/${encodeURIComponent(String(targetId))}`,
            undefined,
            async (response) => {
                console.log("Marked as good:", response.data);
            },
            async (errorResponse) => {
                console.error("Failed to mark as good:", errorResponse.message);
            }
        );
    }, []);

    // 「バッド」を登録
    const markAsBad = useCallback(async (targetId: string) => {
        await APIcall<void, string>(
            "PUT",
            `/job/api/v1/bad/${encodeURIComponent(String(targetId))}`,
            undefined,
            async (response) => {
                console.log("Marked as bad:", response.data);
            },
            async (errorResponse) => {
                console.error("Failed to mark as bad:", errorResponse.message);
            }
        );
    }, []);

    // 「保存」を登録
    const markAsSave = useCallback(async (targetId: string) => {
        await APIcall<void, string>(
            "PUT",
            `/job/api/v1/save/${encodeURIComponent(String(targetId))}`,
            undefined,
            async (response) => {
                console.log("Marked as save:", response.data);
            },
            async (errorResponse) => {
                console.error("Failed to mark as save:", errorResponse.message);
            }
        );
    }, []);

    const resetSwipe = () => {
        x.set(0);
        setSwipeDirection("center");
        setExpanded(false);
        setImageFullscreen(false);
    };

    // 左右スワイプの判定(距離か速さで判定)
    const handleDragEndMain = useCallback((_: any, info: any) => {
        const threshold = 180; // 距離の閾値
        const velocityThreshold = 500; // 速度の閾値
        const current = currentJob;

        if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
            setSwipeDirection("right");
            // 右スワイプ = いいね
            if (current) {
                markAsGood(current.history_id);
                fetchRecommendations();
                resetSwipe();
            }
        } else if (
            info.offset.x < -threshold ||
            info.velocity.x < -velocityThreshold
        ) {
            setSwipeDirection("left");
            // 左スワイプ = バッド
            if (current) {
                markAsBad(current.history_id);
                fetchRecommendations();
                resetSwipe();
            }
        } else {
            setSwipeDirection("center");
        }
    }, [currentJob, fetchRecommendations, markAsGood, markAsBad, resetSwipe]);

    // 画像部分のスワイプ処理
    const handleImageDragEnd = (_: any, info: any) => {
        if (info.offset.y < -50) {
            setImageFullscreen(true);
            setExpanded(false);
        } else if (info.offset.y > 50) {
            setImageFullscreen(false);
        }
    };

    // 給与情報部分のスワイプ処理
    const handleDetailDragEnd = (_: any, info: any) => {
        if (info.offset.y < -50) setExpanded(true);
        if (info.offset.y > 50) setExpanded(false);
    };

    // 保存ボタン用のハンドラー
    const handleSave = useCallback(() => {
        if (currentJob) {
            markAsSave(currentJob.history_id);
        }
    }, [currentJob, markAsSave]);

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
        currentJob,
        isLoading,
        error,
        fetchRecommendations,
        markAsGood,
        markAsBad,
        markAsSave,
    };
};
