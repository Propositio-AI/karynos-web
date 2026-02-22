import { Card } from "@/components/ui/molecules/Card"
import { VerticalStackContainer, GridContainer } from "@/components/ui/molecules/Container"

type EnvironmentItemProps = {
    label: string
    value: string | number
}

const EnvironmentItem = ({ label, value }: EnvironmentItemProps) => (
    <VerticalStackContainer space={1}>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
    </VerticalStackContainer>
)

type WorkEnvironmentProps = {
    age: number
    tenureYears: number
    marriageAge: number
    genderRatio: number
    romanceRate: number
    workLifeBalance: number
    rarity: number
}

export const WorkEnvironment = ({
    age,
    tenureYears,
    marriageAge,
    genderRatio,
    romanceRate,
    workLifeBalance,
    rarity
}: WorkEnvironmentProps) => {
    return (
        <Card className="p-6 mb-6">
            <VerticalStackContainer space={4}>
                <h2 className="text-2xl font-bold">職場環境</h2>
                <GridContainer minWidth={200}>
                    <EnvironmentItem label="平均年齢" value={`${age}歳`} />
                    <EnvironmentItem label="平均勤続年数" value={`${tenureYears}年`} />
                    <EnvironmentItem label="平均結婚年齢" value={`${marriageAge}歳`} />
                    <EnvironmentItem label="男女比" value={`${(genderRatio * 100).toFixed(0)}%`} />
                    <EnvironmentItem label="社内恋愛率" value={`${(romanceRate * 100).toFixed(0)}%`} />
                    <EnvironmentItem label="ワークライフバランス" value={`${workLifeBalance}/10`} />
                    <EnvironmentItem label="レア度" value={`${(rarity * 100).toFixed(0)}%`} />
                </GridContainer>
            </VerticalStackContainer>
        </Card>
    )
}
