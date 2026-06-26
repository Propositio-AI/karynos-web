"use client";

import {
    getCurrentAuthState,
    subscribeAuthChanged,
} from "@/lib/auth/session";
import { api } from "@/lib/api/client";
import { hasLocalOnboardingAnswer } from "@/lib/onboarding/localStatus";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ONBOARDING_VERSION = 1;
const ONBOARDING_PATH = "/job/match/question";
const publicPathPrefixes = ["/login", "/signup"];

const isPublicPath = (pathname: string) => {
    return publicPathPrefixes.some((prefix) => pathname.startsWith(prefix));
};

const isOnboardingAnswered = async (allowLocalStatus: boolean) => {
    if (
        allowLocalStatus &&
        hasLocalOnboardingAnswer(ONBOARDING_VERSION)
    ) {
        return true;
    }

    const history =
        await api.getOnboardingAnswersHistoryApiV1OnboardingAnswersHistoryGet();

    return history.some(
        (answer) => answer.question_version === ONBOARDING_VERSION,
    );
};

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isPublic = useMemo(() => isPublicPath(pathname), [pathname]);

    useEffect(() => {
        let cancelled = false;

        const checkAuth = async () => {
            setIsChecking(true);
            const state = await getCurrentAuthState();
            if (cancelled) return;

            setIsAuthenticated(state.isAuthenticated);

            if (!state.isAuthenticated && !isPublic) {
                setIsChecking(false);
                router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
                return;
            }

            if (state.isAuthenticated && pathname === "/login") {
                setIsChecking(false);
                router.replace("/job/match");
                return;
            }

            if (
                state.isAuthenticated &&
                !isPublic &&
                pathname !== ONBOARDING_PATH
            ) {
                try {
                    const answered = await isOnboardingAnswered(
                        state.mode === "mock",
                    );
                    if (cancelled) return;

                    if (!answered) {
                        setIsChecking(false);
                        router.replace(ONBOARDING_PATH);
                        return;
                    }
                } catch {
                    // If the check fails, keep the app usable and let the page API show details.
                }
            }

            setIsChecking(false);
        };

        checkAuth();
        const unsubscribe = subscribeAuthChanged(checkAuth);

        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, [isPublic, pathname, router]);

    if (isChecking && !isPublic) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
                <div className="rounded-lg border border-line bg-surface px-6 py-5 text-sm font-bold text-muted shadow-soft">
                    セッションを確認中...
                </div>
            </div>
        );
    }

    if (!isAuthenticated && !isPublic) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
                <div className="rounded-lg border border-line bg-surface px-6 py-5 text-sm font-bold text-muted shadow-soft">
                    ログイン画面へ移動しています...
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
