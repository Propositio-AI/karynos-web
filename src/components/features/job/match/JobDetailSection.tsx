import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { BaseButton } from "@/components/ui/atoms/Button";
import { CircularProgress } from "@/components/ui/molecules/CircularProgress";
import { useJobChat } from "@/hooks/features/job/useJobChat";

type JobDetailSectionProps = {
    imageFullscreen: boolean;
    expanded: boolean;
    onDragEnd: (event: any, info: any) => void;
    jobId?: number;
    historyId?: string;
    cardIndex?: number;
    jobName?: string;
    averageSalary?: number | null;
    similarityScore?: number | null;
    averageAge?: number | null;
    description?: string;
    onSave?: () => void;
};

export const JobDetailSection = ({
    imageFullscreen,
    expanded,
    onDragEnd,
    jobId = 0,
    historyId,
    cardIndex = 0,
    jobName = "",
    averageSalary = null,
    similarityScore = null,
    averageAge = null,
    description = "職業説明はまだありません。",
    onSave,
}: JobDetailSectionProps) => {
    const { startChatForJob, isCreating } = useJobChat();
    const [isCreatingChat, setIsCreatingChat] = useState(false);

    const handleChatClick = async () => {
        setIsCreatingChat(true);
        await startChatForJob(jobId);
        setIsCreatingChat(false);
    };

    const salaryValue = averageSalary ?? 0;
    const similarityValue = similarityScore ?? 0;
    const ageValue = averageAge ?? 0;
    const detailHref = historyId
        ? {
              pathname: `/job/detail/${jobId}`,
              query: {
                  history_id: historyId,
                  card_index: cardIndex,
              },
          }
        : `/job/detail/${jobId}`;

    return (
        <motion.div
            className="absolute bottom-0 z-20 w-full rounded-t-lg border-t border-line bg-surface p-4 shadow-lift"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={onDragEnd}
            initial="collapsed"
            animate={imageFullscreen ? "hidden" : expanded ? "expanded" : "collapsed"}
            variants={{
                collapsed: {
                    height: "55%",
                    opacity: 1,
                    overflowY: "hidden",
                },
                expanded: {
                    height: "82%",
                    opacity: 1,
                    overflowY: "auto",
                },
                hidden: { height: "0%", opacity: 0 },
            }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 18,
            }}
            style={{
                pointerEvents: imageFullscreen ? "none" : "auto",
            }}
        >
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-line" />

            {jobName && (
                <div className="px-1 pb-3">
                    <p className="mb-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                        Match #{cardIndex + 1}
                    </p>
                    <h2 className="text-xl font-extrabold text-ink">
                        {jobName}
                    </h2>
                </div>
            )}

            <div className="grid grid-cols-3 gap-2 px-1 py-1">
                <CircularProgress
                    label="年収"
                    value={salaryValue}
                    max={1000}
                    unit="万円"
                    color="#f59e0b"
                    size={64}
                    strokeWidth={7}
                />
                <CircularProgress
                    label="適合度"
                    value={Math.round(similarityValue)}
                    max={100}
                    unit="%"
                    color="#10b981"
                    size={64}
                    strokeWidth={7}
                />
                <CircularProgress
                    label="年齢"
                    value={ageValue}
                    max={60}
                    unit="歳"
                    color="#0b1120"
                    size={64}
                    strokeWidth={7}
                />
            </div>

            {expanded && (
                <div className="mt-5 grid grid-cols-3 gap-2 rounded-lg border border-line bg-stone-50 p-2">
                    <Link href={detailHref}>
                        <BaseButton color="slate" className="w-full">
                            詳細
                        </BaseButton>
                    </Link>
                    <BaseButton
                        color="white"
                        className="w-full"
                        onClick={onSave}
                    >
                        保存
                    </BaseButton>
                    <BaseButton
                        color="emerald"
                        className="w-full"
                        onClick={handleChatClick}
                        isLoading={isCreatingChat || isCreating}
                    >
                        相談
                    </BaseButton>
                </div>
            )}

            {expanded && (
                <div className="my-5 px-1 pb-4">
                    <h3 className="text-base font-bold text-ink">仕事内容</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
                </div>
            )}
        </motion.div>
    );
};
