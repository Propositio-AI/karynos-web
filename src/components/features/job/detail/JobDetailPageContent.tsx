"use client";

import { useParams } from "next/navigation";
import { useDetail } from "@/hooks/features/job/useDetail";
import { useJobChat } from "@/hooks/features/job/useJobChat";
import { JobHeader } from "@/components/features/job/detail/JobHeader";
import { BasicInfoCards } from "@/components/features/job/detail/BasicInfoCards";
import { WorkEnvironment } from "@/components/features/job/detail/WorkEnvironment";
import { DetailDescriptions } from "@/components/features/job/detail/DetailDescriptions";
import { InfoSection } from "@/components/features/job/detail/InfoSection";
import { SkillsAndRequirements } from "@/components/features/job/detail/SkillsAndRequirements";
import { CompanyList } from "@/components/features/job/detail/CompanyList";
import { ActionButtons } from "@/components/features/job/detail/ActionButtons";

export default function JobDetailPageContent() {
	const params = useParams();
	const jobId = params.job_id as string;
	const { jobData, isLoading, error } = useDetail(jobId);
	const { startChatForJob, isCreating } = useJobChat();

	const handleChatClick = () => {
		if (jobData) {
			startChatForJob(jobData.job_id);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-500">読み込み中...</p>
			</div>
		);
	}

	if (error || !jobData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-500">{error || "データが見つかりません"}</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<JobHeader
					jobId={jobData.job_id}
					name={jobData.name}
					description={jobData.description}
					imgs={jobData.imgs}
					level={jobData.level}
					uniform={jobData.uniform}
					focusOnEducation={jobData.focus_on_education}
					focusOnAchievements={jobData.focus_on_achievements}
				/>

				<BasicInfoCards
					salary={jobData.salary}
					holiday={jobData.holiday}
					endTime={jobData.end_time}
					overtimeHours={jobData.overtime_hours}
				/>

				<WorkEnvironment
					age={jobData.age}
					tenureYears={jobData.tenure_years}
					marriageAge={jobData.marriage_age}
					genderRatio={jobData.gender_ratio}
					romanceRate={jobData.romance_rate}
					workLifeBalance={jobData.work_life_balance}
					rarity={jobData.rarity}
				/>

				<DetailDescriptions
					socialSignification={jobData.social_signification}
					personalityTraits={jobData.personality_traits}
					growthOpportunities={jobData.growth_opportunities}
					wrongImage={jobData.wrong_image}
					futureOutlook={jobData.future_outlook}
					scandalHistory={jobData.scandal_history}
				/>

				<InfoSection title="アピールポイント" content={jobData.appeal_points} />
				<InfoSection
					title="一日の流れ"
					content={jobData.daily_routine}
					preserveWhitespace
				/>
				<InfoSection title="コメント" content={jobData.comments} />

				<SkillsAndRequirements
					skills={jobData.skills}
					certifications={jobData.certifications}
					talents={jobData.talents}
					interests={jobData.interests}
				/>

				<CompanyList companies={jobData.companies} />

				<ActionButtons
					jobId={jobData.job_id}
					onChatClick={handleChatClick}
					isCreatingChat={isCreating}
				/>
			</div>
		</div>
	);
}
