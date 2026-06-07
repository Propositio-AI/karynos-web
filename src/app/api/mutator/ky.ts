import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const baseURL =
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	(process.env.NODE_ENV === "development" ? "http://localhost:8080" : "");

const api = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(async (config) => {
	if (typeof window === "undefined") {
		return config;
	}

	try {
		const session = await fetchAuthSession();
		const accessToken = session.tokens?.accessToken?.toString();

		if (accessToken) {
			config.headers = config.headers ?? {};
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
	} catch {
		// Requests can still continue for unauthenticated endpoints.
	}

	return config;
});

export const customInstance = async <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig,
): Promise<T> => {
	const source = axios.CancelToken.source();

	const promise = api({
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
