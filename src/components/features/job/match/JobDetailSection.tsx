import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { CircularProgress } from "@/components/ui/molecules/CircularProgress";
import { BaseButton } from "@/components/ui/atoms/Button";
import { useJobChat } from "@/hooks/features/job/useJobChat";

type JobDetailSectionProps = {
    imageFullscreen: boolean;
    expanded: boolean;
    onDragEnd: (event: any, info: any) => void;
    jobId?: number;
    jobName?: string;
    averageSalary?: number | null;
    similarityScore?: number | null;
    averageAge?: number | null;
    description?: string;
};

export const JobDetailSection = ({
    imageFullscreen,
    expanded,
    onDragEnd,
    jobId = 0,
    jobName = "",
    averageSalary = null,
    similarityScore = null,
    averageAge = null,
    description = "Webアプリケーションやモバイルアプリの設計・開発・保守を行います。チームでの協働やコードレビュー、新技術の導入なども重要な業務です。",
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

    return (
        <motion.div
            className="absolute p-4 bottom-0 w-full bg-white rounded-t-2xl z-20"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={onDragEnd}
            initial="collapsed"
            animate={
                imageFullscreen ? "hidden" : expanded ? "expanded" : "collapsed"
            }
            variants={{
                collapsed: {
                    height: "40%",
                    opacity: 1,
                    overflowY: "hidden",
                },
                expanded: {
                    height: "80%",
                    opacity: 1,
                    overflowY: "scroll",
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
            {/* ドラッグバー */}
            <div className="w-1/4 bg-zinc-200 h-1 rounded-full m-3 mx-auto"></div>

            {/* 職業名 */}
            {jobName && (
                <div className="px-2 pb-2">
                    <h2 className="text-lg font-semibold text-zinc-800">
                        {jobName}
                    </h2>
                </div>
            )}

            {/* 統計情報（展開前に見せる） */}
            <div className="grid grid-cols-3 gap-2 px-2 py-2">
                <CircularProgress
                    label="平均年収"
                    value={salaryValue}
                    max={1000}
                    unit="万"
                    color="#f59e0b"
                    size={90}
                    strokeWidth={10}
                />
                <CircularProgress
                    label="適合度"
                    value={Math.round(similarityValue)}
                    max={100}
                    unit="%"
                    color="#10b981"
                    size={90}
                    strokeWidth={10}
                />
                <CircularProgress
                    label="平均年齢"
                    value={ageValue}
                    max={60}
                    unit="歳"
                    color="#3b82f6"
                    size={90}
                    strokeWidth={10}
                />
            </div>

            {/* 詳細情報 */}
            {expanded && (
                <div className="my-4 px-2">
                    <h3>業務内容</h3>
                    <p className="my-2 text-zinc-500">{description}</p>
                </div>
            )}

            {/* ボタン（展開後に見せる） */}
            {expanded && (
                <div className="flex gap-2 px-2 py-4 fixed bottom-0 left-0 right-0 bg-white">
                    <Link href={`/job/detail/${jobId}`} className="flex-1">
                        <BaseButton
                            color="slate"
                            className="!rounded-full w-full py-3"
                        >
                            詳細を見る
                        </BaseButton>
                    </Link>
                    <BaseButton
                        color="blue"
                        className="!rounded-full w-full py-3 flex-1"
                        onClick={handleChatClick}
                        isLoading={isCreatingChat || isCreating}
                    >
                        チャットで質問する
                    </BaseButton>
                </div>
            )}
        </motion.div>
    );
};
