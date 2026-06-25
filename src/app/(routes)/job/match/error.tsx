"use client";

import MatchErrorContent from "@/components/features/job/match/MatchErrorContent";

export default function MatchError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return <MatchErrorContent error={error} reset={reset} />;
}
