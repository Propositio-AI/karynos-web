/**
 * Types for Job API responses
 * Generated from the provided JSON schema in the user request.
 */

/** Job data used in RecommendResponse */
export type JobData = {
	/** jobs.name */
	name: string;
	/** jobs.imgs */
	imgs: string[];
	/** jobs_feedback.salary */
	salary: number;
	/** jobs_feedback.level */
	level: number;
};

/** JobRecommendation item */
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

/** RecommendResponse from GET /api/v1/recommend */
export type RecommendResponse = {
	recommendation: JobRecommendation;
	analysis_completed_at: string;
};

/** Old RecommendResponse (for backward compatibility if needed)
 * {
 *  job_id: number, // Jobs.job_id
 *  history_id: string, // histories.history_id (UUID)
 *  job_data: JobData
 * }
 */
export type LegacyRecommendResponse = {
	job_id: number;
	history_id: string; // UUID
	job_data: JobData;
};

/** Shared small item types */
export type SkillItem = {
	skill_id: number;
	name: string;
	is_required: boolean;
};

export type CertificationItem = {
	certification_id: number;
	name: string;
	is_required: boolean;
};

export type CompanyItem = {
	company_id: number;
	name: string;
};

export type TalentItem = {
	talent_id: number;
	name: string;
	is_required: boolean;
};

export type InterestItem = {
	interest_id: number;
	name: string;
	is_required: boolean;
};

/** JobDetailResponse
 * Matches the JSON structure provided by the user.
 */
export type JobDetailResponse = {
	job_id: number;
	name: string;
	description: string;
	imgs: string[];
	salary: number;
	level: number;
	end_time: string; // TIME - represented as string (HH:MM:SS or ISO time)
	holiday: number;
	overtime_hours: number;
	age: number;
	tenure_years: number;
	marriage_age: number;
	gender_ratio: number; // FLOAT
	romance_rate: number; // FLOAT
	social_signification: string;
	personality_traits: string;
	growth_opportunities: string;
	wrong_image: string;
	uniform: boolean;
	work_life_balance: number; // FLOAT
	future_outlook: string;
	rarity: number; // FLOAT
	scandal_history: string;
	focus_on_education: boolean;
	focus_on_achievements: boolean;
	appeal_points: string;
	daily_routine: string;
	comments: string;
	skills: SkillItem[];
	certifications: CertificationItem[];
	companies: CompanyItem[];
	talents: TalentItem[];
	interests: InterestItem[];
};

