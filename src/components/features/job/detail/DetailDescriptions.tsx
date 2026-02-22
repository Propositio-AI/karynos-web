import { Card } from "@/components/ui/molecules/Card"
import { VerticalStackContainer, GridContainer } from "@/components/ui/molecules/Container"

type DescriptionCardProps = {
    title: string
    content: string
}

const DescriptionCard = ({ title, content }: DescriptionCardProps) => (
    <Card className="p-6">
        <VerticalStackContainer space={2}>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-gray-700">{content}</p>
        </VerticalStackContainer>
    </Card>
)

type DetailDescriptionsProps = {
    socialSignification: string
    personalityTraits: string
    growthOpportunities: string
    wrongImage: string
    futureOutlook: string
    scandalHistory: string
}

export const DetailDescriptions = ({
    socialSignification,
    personalityTraits,
    growthOpportunities,
    wrongImage,
    futureOutlook,
    scandalHistory
}: DetailDescriptionsProps) => {
    return (
        <GridContainer minWidth={400} className="mb-6">
            <DescriptionCard title="社会的意義" content={socialSignification} />
            <DescriptionCard title="求められる性格特性" content={personalityTraits} />
            <DescriptionCard title="成長機会" content={growthOpportunities} />
            <DescriptionCard title="間違ったイメージ" content={wrongImage} />
            <DescriptionCard title="将来展望" content={futureOutlook} />
            <DescriptionCard title="スキャンダル履歴" content={scandalHistory} />
        </GridContainer>
    )
}
