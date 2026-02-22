import { GridContainer } from "@/components/ui/molecules/Container"
import { DashboardCard } from "@/components/ui/molecules/Card"
import { faYenSign, faCalendar, faClock, faBriefcase } from "@fortawesome/free-solid-svg-icons"

type BasicInfoCardsProps = {
    salary: number
    holiday: number
    endTime: string
    overtimeHours: number
}

export const BasicInfoCards = ({
    salary,
    holiday,
    endTime,
    overtimeHours
}: BasicInfoCardsProps) => {
    return (
        <GridContainer minWidth={250} className="mb-6">
            <DashboardCard title="年収" icon={faYenSign}>
                <span className="text-2xl font-bold">{salary}万円</span>
            </DashboardCard>
            <DashboardCard title="年間休日" icon={faCalendar}>
                <span className="text-2xl font-bold">{holiday}日</span>
            </DashboardCard>
            <DashboardCard title="終業時刻" icon={faClock}>
                <span className="text-2xl font-bold">{endTime}</span>
            </DashboardCard>
            <DashboardCard title="残業時間" icon={faBriefcase}>
                <span className="text-2xl font-bold">{overtimeHours}時間/月</span>
            </DashboardCard>
        </GridContainer>
    )
}
