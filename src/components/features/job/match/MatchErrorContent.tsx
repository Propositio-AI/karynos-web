"use client";

import { useEffect } from "react";
import { CenterContainer } from "@/components/ui/molecules/Container";

export default function MatchErrorContent({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Match page error:", error);
	}, [error]);

	return (
		<CenterContainer className="w-full min-h-screen bg-zinc-50">
			<div className="text-center px-6">
				<p className="text-red-500 font-semibold">画面の表示に失敗しました。</p>
				<p className="text-xs text-zinc-500 mt-2 break-all">{error.message}</p>
				<button
					className="mt-4 px-4 py-2 rounded-full bg-slate text-white"
					onClick={() => reset()}
				>
					再読み込み
				</button>
			</div>
		</CenterContainer>
	);
}
