import { fetchAuthSession } from "aws-amplify/auth";
import { ApiResponse } from "./types";
import type { NewMessageRequest } from "./gen/schema";

type StreamConfig<T = any> = {
    url: string;
    body?: any;
    onChunk: (chunk: string) => void;
    onComplete?: (response: ApiResponse<T>) => void | Promise<void>;
    onError?: (error: ApiResponse<null>) => void | Promise<void>;
};

const defaultBaseUrl =
    process.env.NEXT_PUBLIC_CHAT_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "");

const resolveUrl = (url: string) => {
    try {
        return new URL(url).toString();
    } catch {
        if (!defaultBaseUrl) return url;
        const base = defaultBaseUrl.endsWith("/") ? defaultBaseUrl : `${defaultBaseUrl}/`;
        return new URL(url, base).toString();
    }
};

const getAuthHeaders = async (): Promise<Record<string, string>> => {
    if (typeof window === "undefined") return {};
    try {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();
        if (accessToken) {
            return { Authorization: `Bearer ${accessToken}` };
        }
    } catch {
        // Continue without auth for unauthenticated endpoints.
    }
    return {};
};

export const streamApiCall = async <T = any>({
    url,
    body,
    onChunk,
    onComplete,
    onError,
}: StreamConfig<T>) => {
    const fullUrl = resolveUrl(url);
    try {
        const authHeaders = await getAuthHeaders();
        const response = await fetch(fullUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorText = await response.text();
            const errorMessage = `HTTP error! status: ${response.status}, message: ${errorText}`;
            const errorResponse: ApiResponse<null> = {
                success: false,
                message: [errorMessage],
                data: null,
            };
            if (onError) await onError(errorResponse);
            throw new Error(errorMessage);
        }

        if (!response.body) {
            const errorResponse: ApiResponse<null> = {
                success: false,
                message: ["Response body is null"],
                data: null,
            };
            if (onError) await onError(errorResponse);
            throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        let fullResponse = "";

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
                const chunkValue = decoder.decode(value, { stream: true });
                onChunk(chunkValue);
                fullResponse += chunkValue;
            }
        }

        if (onComplete) {
            const contentType = response.headers.get("content-type") || "";
            const trimmed = fullResponse.trim();
            const looksLikeJson = trimmed.startsWith("{") || trimmed.startsWith("[");
            const shouldParseJson =
                contentType.includes("application/json") || looksLikeJson;

            if (shouldParseJson) {
                try {
                    const finalResponse = JSON.parse(fullResponse) as ApiResponse<T>;
                    await onComplete(finalResponse);
                    return;
                } catch (parseErr) {
                    console.warn("Response is not valid JSON, treating as text:", parseErr);
                }
            }

            const successResponse: ApiResponse<T> = {
                success: true,
                message: [],
                data: fullResponse as any,
            };
            await onComplete(successResponse);
        }
    } catch (error) {
        console.error("Stream error:", error);
        const errorResponse: ApiResponse<null> = {
            success: false,
            message: [error instanceof Error ? error.message : "Unknown error"],
            data: null,
        };
        if (onError) await onError(errorResponse);
    }
};

type StreamMessageCallbacks = {
    onChunk: (chunk: string) => void;
    onComplete?: () => void | Promise<void>;
    onError?: (error: Error) => void | Promise<void>;
};

export const streamChatMessageApiV1ChatMessageConversationIdPost = async (
    conversationId: string,
    newMessageRequest: NewMessageRequest,
    { onChunk, onComplete, onError }: StreamMessageCallbacks,
): Promise<void> => {
    const url = `/api/v1/chat/message/${conversationId}`;
    await streamApiCall({
        url,
        body: newMessageRequest,
        onChunk,
        onComplete: onComplete ? async () => { await onComplete(); } : undefined,
        onError: onError ? async (res) => {
            const msg = res.message?.[0] ?? 'Stream error';
            await onError(new Error(msg));
        } : undefined,
    });
};
