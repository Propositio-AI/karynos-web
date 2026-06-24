"use client";

const ONBOARDING_LOCAL_STATUS_KEY = "karynos.onboardingAnswered";

const isBrowser = () => typeof window !== "undefined";

const getStatusKey = (version: number) =>
    `${ONBOARDING_LOCAL_STATUS_KEY}.${version}`;

export const hasLocalOnboardingAnswer = (version: number) => {
    if (!isBrowser()) {
        return false;
    }

    return window.localStorage.getItem(getStatusKey(version)) === "true";
};

export const markLocalOnboardingAnswered = (version: number) => {
    if (!isBrowser()) {
        return;
    }

    window.localStorage.setItem(getStatusKey(version), "true");
};
