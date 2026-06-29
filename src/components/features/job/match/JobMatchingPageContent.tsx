"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useTransform } from "framer-motion";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CenterContainer } from "@/components/ui/molecules/Container";
import { useJobMatch } from "@/hooks/features/job/useJobMatch";
import { SwipeCard } from "@/components/features/job/match/SwipeCard";
import { JobImageSection } from "@/components/features/job/match/JobImageSection";
import { JobDetailSection } from "@/components/features/job/match/JobDetailSection";
import { SwipeResultMessage } from "@/components/features/job/match/SwipeResultMessage";

const AppNameLabel = () => (
	<p className="absolute left-4 top-4 z-40 text-xl font-bold tracking-tight text-ink sm:left-10 sm:text-3xl">
		Dream Matching
	</p>
);

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
		toggleExpanded,
		currentJob,
		cardIndex,
		isLoading,
		error,
	} = useJobMatch();

	const hasShownHintRef = useRef(false);

	useEffect(() => {
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (hasShownHintRef.current || !currentJob || cardIndex !== 0 || prefersReducedMotion) {
			return;
		}
		hasShownHintRef.current = true;

		const timer = window.setTimeout(() => {
			animate(x, [0, -36, 28, 0], {
				duration: 1.1,
				times: [0, 0.35, 0.7, 1],
				ease: "easeInOut",
			});
		}, 600);

		return () => window.clearTimeout(timer);
	}, [currentJob, cardIndex, x]);

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
			<CenterContainer className="relative min-h-[calc(100vh-6rem)] w-full bg-canvas px-6">
				<AppNameLabel />
				<div className="rounded-(--radius-sm) border border-line bg-surface px-6 py-5 text-sm font-semibold text-muted">
					読み込み中...
				</div>
			</CenterContainer>
		);
	}

	if (error) {
		return (
			<CenterContainer className="relative min-h-[calc(100vh-6rem)] w-full bg-canvas px-6">
				<AppNameLabel />
				<div className="max-w-md rounded-(--radius-sm) border border-red-200 bg-red-50 px-6 py-5 text-sm font-semibold text-red-600">
					{error}
				</div>
			</CenterContainer>
		);
	}

	if (!currentJob) {
		return (
			<CenterContainer className="relative min-h-[calc(100vh-6rem)] w-full bg-canvas px-6">
				<AppNameLabel />
				<div className="rounded-(--radius-sm) border border-line bg-surface px-6 py-5 text-sm font-semibold text-muted">
					おすすめの職業がありません。
				</div>
			</CenterContainer>
		);
	}

	const imageUrl = currentJob.imgs?.[0] || "/sample.png";
	const salaryMan =
		currentJob.salary > 10000
			? Math.round(currentJob.salary / 10000)
			: Math.round(currentJob.salary);

	return (
		<motion.main
			className="relative flex min-h-[calc(100vh-6rem)] w-full items-center justify-center overflow-hidden px-4 py-4"
			style={{ backgroundColor: backgroundTint }}
		>
			<AppNameLabel />

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
					onToggleExpand={toggleExpanded}
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

			{swipeDirection === "center" && !expanded && !imageFullscreen && (
				<div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex items-center justify-center gap-4 text-xs font-medium text-subtle">
					<span className="flex items-center gap-1.5">
						<FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
						興味なし
					</span>
					<span className="h-3 w-px bg-line" />
					<span className="flex items-center gap-1.5">
						気になる
						<FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
					</span>
				</div>
			)}

			<SwipeResultMessage swipeDirection={swipeDirection} onReset={resetSwipe} />
		</motion.main>
	);
}
