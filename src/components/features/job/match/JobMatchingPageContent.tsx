"use client";

import { motion, useTransform } from "framer-motion";
import { CenterContainer } from "@/components/ui/molecules/Container";
import { useJobMatch } from "@/hooks/features/job/useJobMatch";
import { SwipeCard } from "@/components/features/job/match/SwipeCard";
import { JobImageSection } from "@/components/features/job/match/JobImageSection";
import { JobDetailSection } from "@/components/features/job/match/JobDetailSection";
import { SwipeResultMessage } from "@/components/features/job/match/SwipeResultMessage";

export default function JobMatchingPageContent() {
    const {
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
        cardIndex,
        isLoading,
        error,
    } = useJobMatch();

    const backgroundTint = useTransform(
        x,
        [-240, -80, 0, 80, 240],
        [
            "rgb(250, 247, 244)",
            "rgb(250, 249, 247)",
            "rgb(250, 249, 247)",
            "rgb(243, 250, 247)",
            "rgb(236, 247, 242)",
        ],
    );

    if (isLoading) {
        return (
            <CenterContainer className="min-h-[calc(100vh-6rem)] w-full bg-canvas px-6">
                <div className="rounded-(--radius-sm) border border-line bg-surface px-6 py-5 text-sm font-semibold text-muted">
                    読み込み中...
                </div>
            </CenterContainer>
        );
    }

    if (error) {
        return (
            <CenterContainer className="min-h-[calc(100vh-6rem)] w-full bg-canvas px-6">
                <div className="max-w-md rounded-(--radius-sm) border border-red-200 bg-red-50 px-6 py-5 text-sm font-semibold text-red-600">
                    {error}
                </div>
            </CenterContainer>
        );
    }

    if (!currentJob) {
        return (
            <CenterContainer className="min-h-[calc(100vh-6rem)] w-full bg-canvas px-6">
                <div className="rounded-(--radius-sm) border border-line bg-surface px-6 py-5 text-sm font-semibold text-muted">
                    おすすめの職業がありません。
                </div>
            </CenterContainer>
        );
    }

    const imageUrl = currentJob.imgs?.[0] || "/sample.png";
    const salaryMan = currentJob.salary > 10000
        ? Math.round(currentJob.salary / 10000)
        : Math.round(currentJob.salary);

    return (
        <motion.main
            className="relative flex min-h-[calc(100vh-6rem)] w-full items-center justify-center overflow-hidden px-4 py-4"
            style={{ backgroundColor: backgroundTint }}
        >
            <SwipeCard
                swipeDirection={swipeDirection}
                x={x}
                rotate={rotate}
                opacity={opacity}
                expanded={expanded}
                customDirection={customDirection}
                onDragEnd={handleDragEndMain}
            >
                <JobImageSection
                    imageFullscreen={imageFullscreen}
                    expanded={expanded}
                    onDragEnd={handleImageDragEnd}
                    imageUrl={imageUrl}
                />
                <JobDetailSection
                    imageFullscreen={imageFullscreen}
                    expanded={expanded}
                    onDragEnd={handleDetailDragEnd}
                    jobId={currentJob.job_id}
                    jobName={currentJob.name}
                    historyId={currentJob.history_id}
                    cardIndex={cardIndex}
                    averageSalary={salaryMan}
                    similarityScore={currentJob.similarity_score}
                    averageAge={currentJob.age}
                    description={currentJob.description || "職業説明はまだありません。"}
                    onSave={handleSave}
                />
            </SwipeCard>

            <SwipeResultMessage swipeDirection={swipeDirection} onReset={resetSwipe} />
        </motion.main>
    );
}
