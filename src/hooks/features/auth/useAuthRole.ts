"use client";

import { useState, useEffect } from "react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export type UserRole = "mentor" | "dreamer" | null;

export const useAuthRole = () => {
    const [role, setRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [session, user] = await Promise.all([
                    fetchAuthSession(),
                    getCurrentUser(),
                ]);

                setUserId(user.userId);

                const payload = session.tokens?.idToken?.payload;
                if (!payload) {
                    setRole(null);
                    return;
                }

                // Cognito groups take priority
                const groups = payload["cognito:groups"] as string[] | undefined;
                if (groups?.includes("mentor")) {
                    setRole("mentor");
                } else if (groups?.includes("dreamer")) {
                    setRole("dreamer");
                } else {
                    // Fallback: custom attribute
                    const customRole = payload["custom:role"] as string | undefined;
                    if (customRole === "mentor" || customRole === "dreamer") {
                        setRole(customRole);
                    } else {
                        setRole("dreamer");
                    }
                }
            } catch {
                setRole(null);
                setUserId(null);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    return {
        role,
        isLoading,
        userId,
        isMentor: role === "mentor",
        isDreamer: role === "dreamer",
    };
};
