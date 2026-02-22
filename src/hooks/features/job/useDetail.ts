import { useState, useEffect } from "react"
import { JobDetailResponse } from "@/types/api/job"
import APIcall from "@/lib/api-client/api-call"
import { ApiErrorResponse } from "@/lib/api-client/type"

export const useDetail = (jobId: string) => {
    const [jobData, setJobData] = useState<JobDetailResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchJobDetail = async () => {
            setIsLoading(true)
            setError(null)

            await APIcall<void, JobDetailResponse>(
                "GET",
                `/job/api/v1/detail/${jobId}`,
                undefined,
                async (data) => {
                    setJobData(data.data)
                    setIsLoading(false)
                },
                async (error) => {
                    // setError(error.message || "データの取得に失敗しました")
                    setIsLoading(false)
                }
            )
        }

        fetchJobDetail()
    }, [jobId])

    return { jobData, isLoading, error }
}

/* 以下はモックデータ（開発用）
const mockData: JobDetailResponse = {
    job_id: parseInt(jobId),
    name: "サンプル職業",
    description: "これはサンプルの職業説明です",
    imgs: ["/placeholder.jpg"],
    salary: 450,
                    level: 3,
                    end_time: "18:00:00",
                    holiday: 120,
                    overtime_hours: 20,
                    age: 28,
                    tenure_years: 5,
                    marriage_age: 30,
                    gender_ratio: 0.6,
                    romance_rate: 0.25,
                    social_signification: "社会に貢献度の高い職業です",
                    personality_traits: "協調性、コミュニケーション能力、問題解決能力",
                    growth_opportunities: "専門スキルの習得、リーダーシップの育成、キャリアアップの機会",
                    wrong_image: "激務というイメージがあるが、実際はワークライフバランスが取りやすい",
                    uniform: true,
                    work_life_balance: 7.5,
                    future_outlook: "AIとの共存により、より創造的な業務にシフト",
                    rarity: 0.15,
                    scandal_history: "特になし",
                    focus_on_education: true,
                    focus_on_achievements: false,
                    appeal_points: "チームワークを大切にする環境、充実した研修制度、フレックスタイム制度",
                    daily_routine: "9:00 出勤・朝礼, 10:00 業務開始, 12:00 昼休憩, 13:00 午後業務, 18:00 退勤",
                    comments: "やりがいのある仕事で、チームメンバーとの協力が不可欠です",
                    skills: [
                        { skill_id: 1, name: "プログラミング", is_required: true },
                        { skill_id: 2, name: "プロジェクト管理", is_required: false }
                    ],
                    certifications: [
                        { certification_id: 1, name: "基本情報技術者", is_required: false }
                    ],
                    companies: [
                        { company_id: 1, name: "株式会社サンプル" }
                    ],
                    talents: [
                        { talent_id: 1, name: "論理的思考", is_required: true },
                        { talent_id: 2, name: "創造性", is_required: false }
                    ],
    interests: [
        { interest_id: 1, name: "テクノロジー", is_required: true },
        { interest_id: 2, name: "ビジネス", is_required: false }
    ]
}
*/
