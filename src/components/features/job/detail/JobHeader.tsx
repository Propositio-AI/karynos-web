import Image from "next/image";
import { Card } from "@/components/ui/molecules/Card";
import { Tag } from "@/components/ui/atoms/Text";
import { BaseButton } from "@/components/ui/atoms/Button";

type JobHeaderProps = {
    jobId: number;
    name: string;
    description: string;
    imgs: string[];
    level: number;
    uniform: boolean;
    focusOnEducation: boolean;
    focusOnAchievements: boolean;
};

export const JobHeader = ({
    jobId,
    name,
    description,
    imgs,
    level,
    uniform,
    focusOnEducation,
    focusOnAchievements,
}: JobHeaderProps) => {
    return (
        <Card className="mb-5 overflow-hidden">
            {imgs.length > 0 && (
                <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-brand-50 sm:aspect-[16/7]">
                    <Image
                        src={imgs[0] ?? ""}
                        alt={name}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 640px) 100vw, 1152px"
                    />
                </div>
            )}

            <div className="p-5 sm:p-7">
                <div className="mb-4 flex flex-wrap gap-2">
                    <Tag text={`レベル ${level}`} color="blue" />
                    {uniform && <Tag text="制服あり" color="slate" />}
                    {focusOnEducation && <Tag text="学歴重視" color="green" />}
                    {focusOnAchievements && <Tag text="実績重視" color="orange" />}
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-bold text-subtle">Job #{jobId}</p>
                        <h1 className="text-2xl font-extrabold leading-tight text-ink sm:text-4xl">
                            {name}
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                            {description}
                        </p>
                    </div>

                    <BaseButton color="white" className="w-full sm:w-auto">
                        気になる
                    </BaseButton>
                </div>
            </div>
        </Card>
    );
};
