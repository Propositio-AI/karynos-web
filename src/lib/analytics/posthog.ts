"use client";

import posthog from "posthog-js";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

let initialized = false;

const isBrowser = () => typeof window !== "undefined";

const getPostHogToken = () =>
	process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_KEY;

export const isPostHogEnabled = () => {
	return isBrowser() && Boolean(getPostHogToken());
};

export const ensurePostHog = () => {
	if (!isBrowser() || initialized) {
		return initialized;
	}

	const token = getPostHogToken();
	if (!token) {
		return false;
	}

	posthog.init(token, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
		defaults: "2026-01-30",
		capture_pageview: false,
	});

	initialized = true;
	return true;
};

export const captureAnalyticsEvent = (eventName: string, properties: AnalyticsProperties = {}) => {
	if (!ensurePostHog()) {
		return;
	}

	posthog.capture(eventName, properties);
};
