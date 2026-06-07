"use client";

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
		currentJob,
		isLoading,
		error,
	} = useJobMatch();

	if (isLoading) {
		return (
			<CenterContainer className="w-full min-h-screen overflow-hidden bg-zinc-50">
				<p className="text-zinc-500">読み込み中...</p>
			</CenterContainer>
		);
	}

	if (error) {
		return (
			<CenterContainer className="w-full min-h-screen overflow-hidden bg-zinc-50">
				<p className="text-red-500">{error}</p>
			</CenterContainer>
		);
	}

	if (!currentJob) {
		return (
			<CenterContainer className="w-full min-h-screen overflow-hidden bg-zinc-50">
				<p className="text-zinc-500">おすすめの職業がありません。</p>
			</CenterContainer>
		);
	}

	const imageUrl = currentJob.imgs?.[0] || "/sample.png";
	const salaryMan = Math.round(currentJob.salary / 10000);

	return (
		<CenterContainer className="relative w-full min-h-screen overflow-hidden bg-zinc-50">
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
					averageSalary={salaryMan}
					similarityScore={currentJob.similarity_score}
					averageAge={currentJob.age}
					description={currentJob.description || "職業分析はまだありません。"}
				/>
			</SwipeCard>

			<SwipeResultMessage swipeDirection={swipeDirection} onReset={resetSwipe} />
		</CenterContainer>
	);
}
