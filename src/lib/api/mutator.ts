import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import "@/lib/auth/amplify";

const baseURL =
    typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        : "";

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(async (config) => {
    if (typeof window === "undefined") {
        return config;
    }

    try {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();

        if (accessToken) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
        }
    } catch {
        // Unauthenticated endpoints can still proceed.
    }

    const dreamerId = window.localStorage.getItem("karynos.dreamerId");
    if (dreamerId) {
        config.headers = config.headers ?? {};
        config.headers["X-Dreamer-Id"] = dreamerId;
    }

    return config;
});

export const customInstance = async <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = axios.CancelToken.source();

    const promise = axiosInstance({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    (promise as Promise<T> & { cancel?: () => void }).cancel = () => {
        source.cancel("Request was cancelled");
    };

    return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
