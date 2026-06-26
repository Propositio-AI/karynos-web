export type JobRecommendation = {
	job_id: number;
	imgs: string[];
	name: string;
	salary: number;
	similarity_score: number;
	age: number;
	description: string;
	history_id: string;
};

/**
 * NOTE: OpenAPI spec (TopRecommendedJobMatch) doesn't match actual response shape.
 * These manual types remain until the backend spec is corrected.
 */
export type RecommendResponse = {
	recommendation: JobRecommendation;
	analysis_completed_at: string;
};
