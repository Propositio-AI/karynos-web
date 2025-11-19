export type ErrorType = {
	// Human-readable error message
	message: string;
	// Optional machine-readable code
	code?: string | number;
	// Optional HTTP status
	status?: number;
	// Field errors or nested payloads
	errors?: Record<string, string[] | string> | string;
	// Original cause if any
	cause?: unknown;
};
