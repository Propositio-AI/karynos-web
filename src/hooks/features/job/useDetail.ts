import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import type { JobDetailResponse } from "@/lib/api/gen/schema";

export const useDetail = (jobId: string) => {
	const [jobData, setJobData] = useState<JobDetailResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchJobDetail = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const data = await api.getJobDetailApiV1JobDetailJobIdGet(Number(jobId));
				setJobData(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "データの取得に失敗しました");
			} finally {
				setIsLoading(false);
			}
		};

		fetchJobDetail();
	}, [jobId]);

	return { jobData, isLoading, error };
};
