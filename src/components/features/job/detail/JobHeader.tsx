import Image from "next/image"
import { Card } from "@/components/ui/molecules/Card"
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container"
import { Tag } from "@/components/ui/atoms/Text"
import { BaseButton } from "@/components/ui/atoms/Button"

type JobHeaderProps = {
    jobId: number
    name: string
    description: string
    imgs: string[]
    level: number
    uniform: boolean
    focusOnEducation: boolean
    focusOnAchievements: boolean
}

export const JobHeader = ({
    jobId,
    name,
    description,
    imgs,
    level,
    uniform,
    focusOnEducation,
    focusOnAchievements
}: JobHeaderProps) => {
    return (
        <Card className="p-6 mb-6">
            <VerticalStackContainer space={4}>
                {imgs.length > 0 && (
                    <div className="w-full h-64 relative bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                        <Image
                            src={imgs[0] ?? ''}
                            alt="職業画像" 
                            fill
                            className="object-contain"
                        />
                    </div>
                )}
                
                <HorizontalStackContainer className="justify-between items-start">
                    <VerticalStackContainer space={2}>
                        <h1 className="text-3xl font-bold">{name}</h1>
                        <p className="text-gray-600 text-base">{description}</p>
                        <HorizontalStackContainer space={4}>
                            <Tag text={`レベル ${level}`} color="blue" />
                            {uniform && <Tag text="制服あり" color="purple" />}
                            {focusOnEducation && <Tag text="学歴重視" color="green" />}
                            {focusOnAchievements && <Tag text="実績重視" color="orange" />}
                        </HorizontalStackContainer>
                    </VerticalStackContainer>
                    
                    <BaseButton color="blue" className="px-6 py-3">
                        お気に入りに追加
                    </BaseButton>
                </HorizontalStackContainer>
            </VerticalStackContainer>
        </Card>
    )
}
