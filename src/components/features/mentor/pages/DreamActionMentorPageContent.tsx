"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faArrowRight, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer, GridContainer } from "@/components/ui/molecules/Container";
import { DashboardCard } from "@/components/ui/molecules/Card";
import { ClassItem } from "@/types/feature/mentor/class";
import { getClasses } from "@/lib/api/gen/mentor/classes";
import { getDreamActions } from "@/lib/api/gen/dreamAction/dreamAction";
import { DreamActionStatus } from "@/types/feature/dream-action/dreamAction";

type ClassSummary = ClassItem & {
    dreamActionSummary: {
        total: number;
        distributed: number;
        generating: number;
        pending: number;
    };
};

type StatusKey = "none" | "generating" | "has_generated" | "all_distributed";

const STATUS_MAP: Record<StatusKey, { label: string; className: string }> = {
    none: { label: "未生成", className: "bg-zinc-100 text-zinc-600" },
    generating: { label: "生成中", className: "bg-yellow-100 text-yellow-700 animate-pulse" },
    has_generated: { label: "生成済み", className: "bg-blue-100 text-blue-700" },
    all_distributed: { label: "配布完了", className: "bg-emerald-100 text-emerald-700" },
};

const StatusBadge = ({ status }: { status: StatusKey }) => {
    const { label, className } = STATUS_MAP[status];
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>{label}</span>
    );
};

const deriveStatus = (summary: ClassSummary["dreamActionSummary"]): StatusKey => {
    if (summary.generating > 0) return "generating";
    if (summary.distributed > 0 && summary.distributed === summary.total) return "all_distributed";
    if (summary.distributed > 0 || (summary.total - summary.pending) > 0) return "has_generated";
    return "none";
};

export default function DreamActionMentorPageContent() {
    const [classSummaries, setClassSummaries] = useState<ClassSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        setError(null);
        getClasses()
            .then(async (classes) => {
                const summaries = await Promise.all(
                    classes.map(async (cls) => {
                        const actions = await getDreamActions(cls.id).catch(() => []);
                        return {
                            ...cls,
                            dreamActionSummary: {
                                total: actions.length,
                                distributed: actions.filter((a) => a.status === "distributed").length,
                                generating: actions.filter((a) => a.status === "generating").length,
                                pending: actions.filter((a) => a.status === "pending").length,
                            },
                        };
                    })
                );
                setClassSummaries(summaries);
            })
            .catch(() => setError("クラス情報の読み込みに失敗しました。"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const totalDistributed = classSummaries.reduce((a, c) => a + c.dreamActionSummary.distributed, 0);
    const totalGenerated = classSummaries.reduce((a, c) => a + c.dreamActionSummary.total, 0);

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                <h1>Dream Action</h1>
                <p className="text-sm text-zinc-500 -mt-4">
                    授業資料をもとに、生徒ごとの補助教材を生成・配布します。この教材は「補助教材」であり、先生の授業スタイルを変えるものではありません。
                </p>

                {loading ? (
                    <>
                        <GridContainer minWidth={200}>
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-white border border-zinc-200 rounded-lg p-6 animate-pulse h-28" />
                            ))}
                        </GridContainer>
                        <GridContainer minWidth={280}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white border border-zinc-200 rounded-lg p-6 animate-pulse h-32" />
                            ))}
                        </GridContainer>
                    </>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <button className="mt-2 text-sm text-blue-500 underline" onClick={load}>再試行</button>
                    </div>
                ) : (
                    <>
                        <GridContainer minWidth={200}>
                            <DashboardCard title="教材生成数（累計）" icon={faBolt}>
                                <h1 className="text-4xl font-black text-blue-600">
                                    {totalGenerated}
                                    <span className="text-base font-normal text-zinc-500 ml-1">件</span>
                                </h1>
                            </DashboardCard>
                            <DashboardCard title="配布済み（累計）" icon={faChalkboardTeacher}>
                                <h1 className="text-4xl font-black text-emerald-600">
                                    {totalDistributed}
                                    <span className="text-base font-normal text-zinc-500 ml-1">件</span>
                                </h1>
                            </DashboardCard>
                        </GridContainer>

                        <h3 className="font-bold text-slate-800">クラス別 Dream Action 状況</h3>

                        {classSummaries.length === 0 ? (
                            <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
                                <p className="text-zinc-500">クラスがまだ登録されていません</p>
                            </div>
                        ) : (
                            <GridContainer minWidth={280}>
                                {classSummaries.map((cls) => {
                                    const statusKey = deriveStatus(cls.dreamActionSummary);
                                    return (
                                        <Link key={cls.id} href={`/mentor/dream-action/${cls.id}`}>
                                            <div className="bg-white border border-zinc-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer">
                                                <HorizontalStackContainer className="justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">{cls.name}</h3>
                                                        <p className="text-xs text-zinc-500 mt-0.5">{cls.studentCount}名在籍</p>
                                                    </div>
                                                    <StatusBadge status={statusKey} />
                                                </HorizontalStackContainer>

                                                <div className="space-y-1.5 text-xs text-zinc-600">
                                                    <div className="flex justify-between">
                                                        <span>配布済み</span>
                                                        <span className="font-semibold text-emerald-600">
                                                            {cls.dreamActionSummary.distributed}名
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>生成済み</span>
                                                        <span className="font-semibold text-blue-600">
                                                            {cls.dreamActionSummary.total - cls.dreamActionSummary.pending}名
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>未生成</span>
                                                        <span className="font-semibold">
                                                            {cls.dreamActionSummary.pending}名
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end mt-3 text-blue-500 text-xs font-medium">
                                                    管理する
                                                    <FontAwesomeIcon icon={faArrowRight} className="ml-1 w-3 h-3" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </GridContainer>
                        )}
                    </>
                )}
            </VerticalStackContainer>
        </SideBar>
    );
}
