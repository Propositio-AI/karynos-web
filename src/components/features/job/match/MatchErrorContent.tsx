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
        <CenterContainer className="min-h-[calc(100vh-6rem)] w-full bg-canvas px-6">
            <div className="max-w-md rounded-lg border border-red-200 bg-red-50 px-6 py-5 text-center shadow-soft">
                <p className="font-bold text-red-600">画面の表示に失敗しました。</p>
                <p className="mt-2 break-all text-xs text-red-500">{error.message}</p>
                <button
                    className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white"
                    onClick={() => reset()}
                >
                    再読み込み
                </button>
            </div>
        </CenterContainer>
    );
}
