import { Card } from "@/components/ui/molecules/Card"
import { VerticalStackContainer } from "@/components/ui/molecules/Container"

type InfoSectionProps = {
    title: string
    content: string
    preserveWhitespace?: boolean
}

export const InfoSection = ({ title, content, preserveWhitespace = false }: InfoSectionProps) => {
    return (
        <Card className="p-6 mb-6">
            <VerticalStackContainer space={2}>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className={`text-gray-700 ${preserveWhitespace ? 'whitespace-pre-line' : ''}`}>
                    {content}
                </p>
            </VerticalStackContainer>
        </Card>
    )
}
