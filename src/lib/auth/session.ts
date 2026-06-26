"use client";

import {
    confirmSignIn,
    fetchAuthSession,
    getCurrentUser,
    signIn,
    signOut,
} from "aws-amplify/auth";
import { configureAmplify, isCognitoConfigured } from "./amplify";

export type AuthMode = "cognito" | "mock";

export type AuthState = {
    isAuthenticated: boolean;
    mode: AuthMode;
    email?: string;
};

const MOCK_AUTH_KEY = "karynos.mockAuth";
const AUTH_CHANGED_EVENT = "karynos-auth-changed";

const isBrowser = () => typeof window !== "undefined";

const emitAuthChanged = () => {
    if (isBrowser()) {
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    }
};

const getAuthMode = (): AuthMode => {
    return isCognitoConfigured() ? "cognito" : "mock";
};

const getMockAuth = (): AuthState | null => {
    if (!isBrowser()) return null;

    const raw = window.localStorage.getItem(MOCK_AUTH_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as { email?: string };
        return {
            isAuthenticated: true,
            mode: "mock",
            email: parsed.email,
        };
    } catch {
        window.localStorage.removeItem(MOCK_AUTH_KEY);
        return null;
    }
};

const setMockAuth = (email: string) => {
    if (!isBrowser()) return;

    window.localStorage.setItem(
        MOCK_AUTH_KEY,
        JSON.stringify({ email, signedInAt: new Date().toISOString() }),
    );
    emitAuthChanged();
};

const clearMockAuth = () => {
    if (!isBrowser()) return;

    window.localStorage.removeItem(MOCK_AUTH_KEY);
    emitAuthChanged();
};

export const getCurrentAuthState = async (): Promise<AuthState> => {
    const mode = getAuthMode();

    if (mode === "mock") {
        return getMockAuth() ?? { isAuthenticated: false, mode };
    }

    configureAmplify();

    try {
        const [session, user] = await Promise.all([
            fetchAuthSession(),
            getCurrentUser(),
        ]);
        const token = session.tokens?.accessToken?.toString();

        return {
            isAuthenticated: Boolean(token),
            mode,
            email: user.signInDetails?.loginId ?? user.username,
        };
    } catch {
        return { isAuthenticated: false, mode };
    }
};

export const startLogin = async (email: string) => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
        throw new Error("Enter an email address.");
    }

    const mode = getAuthMode();
    if (mode === "mock") {
        setMockAuth(normalizedEmail);
        return { mode, step: "DONE" as const };
    }

    configureAmplify();

    const result = await signIn({
        username: normalizedEmail,
        options: {
            authFlowType: "USER_AUTH",
            preferredChallenge: "EMAIL_OTP",
        },
    });

    if (result.isSignedIn || result.nextStep.signInStep === "DONE") {
        emitAuthChanged();
        return { mode, step: "DONE" as const };
    }

    return { mode, step: "CONFIRM" as const };
};

export const confirmLogin = async (confirmationCode: string) => {
    const code = confirmationCode.trim();
    if (!code) {
        throw new Error("Enter the verification code.");
    }

    if (getAuthMode() === "mock") {
        return { mode: "mock" as const, step: "DONE" as const };
    }

    configureAmplify();

    const result = await confirmSignIn({ challengeResponse: code });
    if (result.isSignedIn || result.nextStep.signInStep === "DONE") {
        emitAuthChanged();
        return { mode: "cognito" as const, step: "DONE" as const };
    }

    return { mode: "cognito" as const, step: "CONFIRM" as const };
};

export const logoutCurrentUser = async () => {
    if (getAuthMode() === "cognito") {
        configureAmplify();
        try {
            await signOut();
        } catch {
            // Local cleanup still needs to run even if Cognito is already signed out.
        }
    }

    clearMockAuth();
};

export const subscribeAuthChanged = (listener: () => void) => {
    if (!isBrowser()) return () => {};

    window.addEventListener(AUTH_CHANGED_EVENT, listener);
    window.addEventListener("storage", listener);

    return () => {
        window.removeEventListener(AUTH_CHANGED_EVENT, listener);
        window.removeEventListener("storage", listener);
    };
};
