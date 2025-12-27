import axios, { AxiosInstance } from "axios";
import { fetchAuthSession, signOut, AuthError } from "aws-amplify/auth";
import { ApiErrorResponse, ApiErrorType } from "./type";

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    headers: {
        'Content-Type': 'application/json',
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
        onSuccess?: (data: TReceive) => Promise<void> | null,
        onError?: (error: ApiErrorResponse) => Promise<void>,
        onUnauthenticated?: () => Promise<void> | void,
    ): Promise<boolean> => {
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
                
                const errorResponse: ApiErrorResponse = {
                    type: ApiErrorType.UNAUTHORIZED,
                    code: 'AUTH_TOKEN_FETCH_FAILED',
                    message: 'Failed to retrieve authentication token',
                };

                if(onError) await onError(errorResponse);
                
                return false;
            }

            throw tokenErr;
        }

        let res;

        switch (method){
            case "GET":
                res = await api.get<TReceive>(url, { ...config, headers });
                break;
                
            case "POST":
                res = await api.post<TReceive>(url, config?.data, { headers });
                break;

            case "PUT":
                res = await api.put<TReceive>(url, config?.data, { headers });
                break;

            case "DELETE":
                res = await api.delete<TReceive>(url, { ...config, headers });
                break;

            default:
                throw new Error(`Unsupported method: ${method}`);
        }
        
        if(onSuccess) await onSuccess(res.data)
        
        return true

    }catch(error: unknown){
        const errorResponse: ApiErrorResponse = {
            type: ApiErrorType.UNKNOWN,
            code: 'UNKNOWN_ERROR',
            message: 'An unexpected error occurred',
        };

        if(axios.isAxiosError(error)){
            if(error.response){
                const http_status = error.response.status;
                const error_data = error.response.data as any;
                
                errorResponse.status = http_status;
                errorResponse.code = `${http_status}-${error_data?.code || 'ERROR'}`;
                errorResponse.message = error_data?.message || error.message;
                errorResponse.type = getErrorType(http_status);

                console.error(`API Error [${errorResponse.code}]: ${errorResponse.message}`);

                // 未認証エラーの特別処理
                if (http_status === 401 || http_status === 403) {
                    await handleUnauthorizedError(onUnauthenticated);
                }

                if(onError) await onError(errorResponse);
            }else if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
                // ネットワークエラー
                errorResponse.type = ApiErrorType.NETWORK_ERROR;
                errorResponse.code = 'NETWORK_ERROR';
                errorResponse.message = 'Network connection error. Please check your internet connection.';
                
                console.error("Network error:", error.message);
                if(onError) await onError(errorResponse);
            } else {
                // その他のAxiosエラー
                errorResponse.code = error.code || 'REQUEST_ERROR';
                errorResponse.message = error.message || 'Request failed';
                
                console.error(`Request error [${errorResponse.code}]: ${errorResponse.message}`);
                if(onError) await onError(errorResponse);
            }
        } else if (error instanceof AuthError) {
            // Cognito認証エラー
            errorResponse.type = ApiErrorType.UNAUTHORIZED;
            errorResponse.code = `AUTH_ERROR-${error.name}`;
            errorResponse.message = error.message || 'Authentication error';
            
            console.error("Cognito auth error:", error.message);
            await handleUnauthorizedError(onUnauthenticated);
            if(onError) await onError(errorResponse);
        } else if (error instanceof Error) {
            errorResponse.type = ApiErrorType.UNKNOWN;
            errorResponse.code = 'UNKNOWN_ERROR';
            errorResponse.message = error.message || 'An unexpected error occurred';
            
            console.error("Unexpected error:", error.message);
            if(onError) await onError(errorResponse);
        }else{
            console.error("Unknown error:", error);
            if(onError) await onError(errorResponse);
        }

        return false
    }
}

export default APIcall;