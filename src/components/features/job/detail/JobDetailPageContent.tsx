"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
import { captureAnalyticsEvent } from "@/lib/analytics/posthog";

export default function JobDetailPageContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const jobId = params.job_id as string;
    const { jobData, isLoading, error } = useDetail(jobId);
    const { startChatForJob, isCreating } = useJobChat();
    const viewedEventKeyRef = useRef<string | null>(null);

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
            return;
        }
        router.push("/job/match");
    };

    useEffect(() => {
        const historyId = searchParams.get("history_id");
        const cardIndexParam = searchParams.get("card_index");

        if (!jobData || !historyId || cardIndexParam === null) {
            return;
        }

        const cardIndex = Number(cardIndexParam);
        if (Number.isNaN(cardIndex)) {
            return;
        }

        const eventKey = `${jobData.job_id}:${historyId}:${cardIndex}`;
        if (viewedEventKeyRef.current === eventKey) {
            return;
        }

        viewedEventKeyRef.current = eventKey;
        captureAnalyticsEvent("job_detail_viewed", {
            job_id: jobData.job_id,
            history_id: historyId,
            card_index: cardIndex,
        });
    }, [jobData, searchParams]);

    const handleChatClick = () => {
        if (jobData) {
            startChatForJob(jobData.job_id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
                <p className="rounded-(--radius-sm) border border-line bg-surface px-6 py-5 text-sm font-semibold text-muted">
                    読み込み中...
                </p>
            </div>
        );
    }

    if (error || !jobData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
                <p className="rounded-(--radius-sm) border border-red-200 bg-red-50 px-6 py-5 text-sm font-semibold text-red-600">
                    {error || "データが見つかりません。"}
                </p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-canvas px-4 pb-48 pt-6 sm:px-6 sm:pt-10">
            <div className="mx-auto w-full max-w-6xl">
                <button
                    type="button"
                    onClick={handleBack}
                    className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
                    戻る
                </button>

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
                <InfoSection title="一日の流れ" content={jobData.daily_routine} preserveWhitespace />
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
        </main>
    );
}
