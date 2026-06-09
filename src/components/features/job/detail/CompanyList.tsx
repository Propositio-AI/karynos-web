import { Card } from "@/components/ui/molecules/Card"
import { VerticalStackContainer } from "@/components/ui/molecules/Container"
import { Tag } from "@/components/ui/atoms/Text"
import type { Company } from "@/lib/api/gen/schema"

type CompanyListProps = {
    companies: Company[]
}

export const CompanyList = ({ companies }: CompanyListProps) => {
    if (companies.length === 0) return null

    return (
        <Card className="p-6 mb-6">
            <VerticalStackContainer space={4}>
                <h2 className="text-2xl font-bold">関連企業</h2>
                <div className="flex flex-wrap">
                    {companies.map((company) => (
                        <Tag
                            key={company.company_id}
                            text={company.name}
                            color="slate" 
                        />
                    ))}
                </div>
            </VerticalStackContainer>
        </Card>
    )
}
