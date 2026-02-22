export enum ApiErrorType {
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    SERVER_ERROR = 'SERVER_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    UNKNOWN = 'UNKNOWN',
}

export interface ApiErrorResponse {
    type: ApiErrorType;
    code: string;
    message: string;
    status?: number;
}

/**
 * 統一されたAPIレスポンス型
 * @template T レスポンスデータの型
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string[];
    data: T;
}