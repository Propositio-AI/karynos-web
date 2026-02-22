import axios, { AxiosInstance } from "axios";
import { fetchAuthSession, signOut, AuthError } from "aws-amplify/auth";
import { ApiErrorResponse, ApiErrorType, ApiResponse } from "./type";

const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "");

const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

type ApiConfig<T> = {
    data?: T
    params?: T
    headers?: Record<string, string>;
}

// 未認証時の処理
const handleUnauthorizedError = async (onUnauthenticated?: () => Promise<void> | void) => {
    console.warn("User authentication expired or invalid");
    
    // カスタムハンドラーがあればそれを実行
    if (onUnauthenticated) {
        try {
            await Promise.resolve(onUnauthenticated());
        } catch (err) {
            console.error("Unauthenticated handler error:", err);
        }
    }
    
    try {
        // Cognitoからサインアウト
        await signOut({ global: true });
    } catch (err) {
        // トークンが既に無効な場合もサイレントに処理
        if (err instanceof AuthError && err.name === 'NotAuthorizedException') {
            console.warn("User was already signed out");
        } else {
            console.error("Sign out error:", err);
        }
    }
};

// HTTPステータスコードからエラータイプを判定
const getErrorType = (status: number): ApiErrorType => {
    switch (status) {
        case 401:
        case 403:
            return ApiErrorType.UNAUTHORIZED;
        case 404:
            return ApiErrorType.NOT_FOUND;
        case 500:
        case 502:
        case 503:
        case 504:
            return ApiErrorType.SERVER_ERROR;
        default:
            return ApiErrorType.UNKNOWN;
    }
};

const APIcall = async <TSend, TReceive>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        url: string,    
        config?: ApiConfig<TSend>,
        onSuccess?: (data: ApiResponse<TReceive>) => Promise<void> | void,
        onError?: (error: ApiResponse<null>) => Promise<void> | void,
        onUnauthenticated?: () => Promise<void> | void,
    ): Promise<void> => {
    try{
        let headers: Record<string, string> = {
            ...config?.headers,
        };

        // Cognitoトークンを取得
        try {
            const session = await fetchAuthSession();
            const accessToken = session.tokens?.accessToken?.toString();
            const idToken = session.tokens?.idToken?.toString();

            // accessTokenをメインで使用（APIアクセス用）
            // idTokenはトークンが取得できない場合のフォールバック
            if (accessToken) {
                headers = {
                    ...headers,
                    Authorization: `Bearer ${accessToken}`,
                };
            } else if (idToken) {
                headers = {
                    ...headers,
                    Authorization: `Bearer ${idToken}`,
                };
            }

        // トークン取得失敗時
        } catch (tokenErr) {
            if (tokenErr instanceof AuthError) {
                console.warn("Token fetch failed:", tokenErr.message);
                // 認証がない場合、未認証ハンドラーを実行
                await handleUnauthorizedError(onUnauthenticated);
                
                const errorResponse: ApiResponse<null> = {
                    success: false,
                    message: ['Failed to retrieve authentication token'],
                    data: null,
                };

                if(onError) await onError(errorResponse);
                
            }

            throw tokenErr;
        }

        let res;

        switch (method){
            case "GET":
                res = await api.get<ApiResponse<TReceive>>(url, { ...config, headers });
                break;
                
            case "POST":
                res = await api.post<ApiResponse<TReceive>>(url, config?.data, { headers });
                break;

            case "PUT":
                res = await api.put<ApiResponse<TReceive>>(url, config?.data, { headers });
                break;

            case "DELETE":
                res = await api.delete<ApiResponse<TReceive>>(url, { ...config, headers });
                break;

            default:
                throw new Error(`Unsupported method: ${method}`);
        }
        
        if(onSuccess) await onSuccess({
            success: true,
            message: [],
            data: res.data as TReceive,
        })

    }catch(error: unknown){
        const errorMessages: string[] = [];
        
        if(axios.isAxiosError(error)){
            if(error.response){
                const http_status = error.response.status;
                const error_data = error.response.data as any;
                
                const message = error_data?.message || error.message;
                errorMessages.push(message);

                console.error(`API Error [${http_status}]: ${message}`);

                // 未認証エラーの特別処理
                if (http_status === 401 || http_status === 403) {
                    await handleUnauthorizedError(onUnauthenticated);
                }

                const errorResponse: ApiResponse<null> = {
                    success: false,
                    message: errorMessages,
                    data: null,
                };
                
                if(onError) await onError(errorResponse);
                
            }else if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
                // ネットワークエラー
                errorMessages.push('Network connection error. Please check your internet connection.');
                
                console.error("Network error:", error.message);
                const errorResponse: ApiResponse<null> = {
                    success: false,
                    message: errorMessages,
                    data: null,
                };
                if(onError) await onError(errorResponse);
                
            } else {
                // その他のAxiosエラー
                errorMessages.push(error.message || 'Request failed');
                
                console.error(`Request error: ${error.message}`);
                const errorResponse: ApiResponse<null> = {
                    success: false,
                    message: errorMessages,
                    data: null,
                };
                if(onError) await onError(errorResponse);
            }
        } else if (error instanceof AuthError) {
            // Cognito認証エラー
            errorMessages.push(error.message || 'Authentication error');
            
            console.error("Cognito auth error:", error.message);
            await handleUnauthorizedError(onUnauthenticated);
            const errorResponse: ApiResponse<null> = {
                success: false,
                message: errorMessages,
                data: null,
            };
            if(onError) await onError(errorResponse);
            
        } else if (error instanceof Error) {
            errorMessages.push(error.message || 'An unexpected error occurred');
            
            console.error("Unexpected error:", error.message);
            const errorResponse: ApiResponse<null> = {
                success: false,
                message: errorMessages,
                data: null,
            };
            if(onError) await onError(errorResponse);
            
        }else{
            console.error("Unknown error:", error);
            errorMessages.push('An unexpected error occurred');
            const errorResponse: ApiResponse<null> = {
                success: false,
                message: errorMessages,
                data: null,
            };
            if(onError) await onError(errorResponse);
        }
    }
}

export default APIcall;