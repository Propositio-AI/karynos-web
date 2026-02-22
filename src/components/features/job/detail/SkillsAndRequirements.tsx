import { Card } from "@/components/ui/molecules/Card"
import { VerticalStackContainer, GridContainer } from "@/components/ui/molecules/Container"
import { Tag } from "@/components/ui/atoms/Text"
import { SkillItem, CertificationItem, TalentItem, InterestItem } from "@/types/api/job"
import { TagColor } from "@/types/ui/atoms/Text"

type RequirementCardProps = {
    title: string
    items: Array<{ id: number; name: string; isRequired: boolean }>
    requiredColor: TagColor
    optionalColor: TagColor
}

const RequirementCard = ({ title, items, requiredColor, optionalColor }: RequirementCardProps) => (
    <Card className="p-6">
        <VerticalStackContainer space={4}>
            <h2 className="text-xl font-bold">{title}</h2>
            <div className="flex flex-wrap">
                {items.map((item) => (
                    <Tag 
                        key={item.id} 
                        text={item.name}
                        color={item.isRequired ? requiredColor : optionalColor}
                        href={`/job/search?q=${encodeURIComponent(item.name)}`}
                    />
                ))}
            </div>
        </VerticalStackContainer>
    </Card>
)

type SkillsAndRequirementsProps = {
    skills: SkillItem[]
    certifications: CertificationItem[]
    talents: TalentItem[]
    interests: InterestItem[]
}

export const SkillsAndRequirements = ({
    skills,
    certifications,
    talents,
    interests
}: SkillsAndRequirementsProps) => {
    const skillItems = skills.map(s => ({ id: s.skill_id, name: s.name, isRequired: s.is_required }))
    const certItems = certifications.map(c => ({ id: c.certification_id, name: c.name, isRequired: c.is_required }))
    const talentItems = talents.map(t => ({ id: t.talent_id, name: t.name, isRequired: t.is_required }))
    const interestItems = interests.map(i => ({ id: i.interest_id, name: i.name, isRequired: i.is_required }))

    return (
        <GridContainer minWidth={350} className="mb-6">
            <RequirementCard 
                title="必要なスキル" 
                items={skillItems} 
                requiredColor="red" 
                optionalColor="blue" 
            />
            <RequirementCard 
                title="関連資格" 
                items={certItems} 
                requiredColor="red" 
                optionalColor="green" 
            />
            <RequirementCard 
                title="求められる才能" 
                items={talentItems} 
                requiredColor="red" 
                optionalColor="purple" 
            />
            <RequirementCard 
                title="関連する興味分野" 
                items={interestItems} 
                requiredColor="red" 
                optionalColor="orange" 
            />
        </GridContainer>
    )
}
