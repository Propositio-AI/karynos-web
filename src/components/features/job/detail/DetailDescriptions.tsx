import { Card } from "@/components/ui/molecules/Card";

type DescriptionCardProps = {
    title: string;
    content: string;
};

const DescriptionCard = ({ title, content }: DescriptionCardProps) => (
    <Card className="p-5 sm:p-6">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-muted">{content}</p>
    </Card>
);

type DetailDescriptionsProps = {
    socialSignification: string;
    personalityTraits: string;
    growthOpportunities: string;
    wrongImage: string;
    futureOutlook: string;
    scandalHistory: string;
};

export const DetailDescriptions = ({
    socialSignification,
    personalityTraits,
    growthOpportunities,
    wrongImage,
    futureOutlook,
    scandalHistory,
}: DetailDescriptionsProps) => {
    return (
        <section className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <DescriptionCard title="社会的意義" content={socialSignification} />
            <DescriptionCard title="求められる性格・特性" content={personalityTraits} />
            <DescriptionCard title="成長機会" content={growthOpportunities} />
            <DescriptionCard title="間違ったイメージ" content={wrongImage} />
            <DescriptionCard title="将来展望" content={futureOutlook} />
            <DescriptionCard title="スキャンダル履歴" content={scandalHistory} />
        </section>
    );
};
