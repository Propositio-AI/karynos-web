"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardTeacher, faUsers, faPlus } from "@fortawesome/free-solid-svg-icons";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, GridContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { DashboardCard } from "@/components/ui/molecules/Card";
import { ClassItem } from "@/types/feature/mentor/class";
import { getClasses } from "@/lib/api/gen/mentor/classes";

const SkeletonCard = () => (
    <div className="bg-white border border-zinc-200 rounded-lg p-5 animate-pulse">
        <div className="h-5 bg-zinc-200 rounded w-1/2 mb-3" />
        <div className="h-4 bg-zinc-100 rounded w-1/3" />
    </div>
);

const ClassCard = ({ cls }: { cls: ClassItem }) => (
    <Link href={`/mentor/classes/${cls.id}`}>
        <div className="bg-white border border-zinc-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-slate-800 truncate">{cls.name}</h3>
                    {cls.description && (
                        <p className="text-xs text-zinc-400 mt-0.5">{cls.description}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-zinc-500">
                <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
                <span>{cls.studentCount}名</span>
            </div>
        </div>
    </Link>
);

export default function ClassListPageContent() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getClasses()
            .then(setClasses)
            .catch(() => setError("クラスの読み込みに失敗しました。"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                <HorizontalStackContainer className="justify-between">
                    <h1>クラス管理</h1>
                    <button
                        disabled
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full opacity-50 cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                        新規クラス作成
                    </button>
                </HorizontalStackContainer>

                {loading ? (
                    <>
                        <GridContainer minWidth={200}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white border border-zinc-200 rounded-md p-6 animate-pulse">
                                    <div className="h-4 bg-zinc-200 rounded w-1/3 mb-2" />
                                    <div className="h-8 bg-zinc-100 rounded w-1/2" />
                                </div>
                            ))}
                        </GridContainer>
                        <GridContainer minWidth={240}>
                            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                        </GridContainer>
                    </>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                            className="mt-3 text-sm text-blue-500 underline"
                            onClick={() => { setLoading(true); setError(null); getClasses().then(setClasses).catch(() => setError("クラスの読み込みに失敗しました。")).finally(() => setLoading(false)); }}
                        >
                            再試行
                        </button>
                    </div>
                ) : (
                    <>
                        <GridContainer minWidth={200}>
                            <DashboardCard title="クラス数" icon={faChalkboardTeacher}>
                                <h1 className="text-5xl font-black">{classes.length}</h1>
                            </DashboardCard>
                            <DashboardCard title="総生徒数" icon={faUsers}>
                                <h1 className="text-5xl font-black">
                                    {classes.reduce((a, c) => a + c.studentCount, 0)}
                                </h1>
                            </DashboardCard>
                        </GridContainer>

                        {classes.length === 0 ? (
                            <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
                                <FontAwesomeIcon icon={faChalkboardTeacher} className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                                <p className="text-zinc-500 font-medium">クラスがまだ登録されていません</p>
                            </div>
                        ) : (
                            <GridContainer minWidth={240}>
                                {classes.map((cls) => (
                                    <ClassCard key={cls.id} cls={cls} />
                                ))}
                            </GridContainer>
                        )}
                    </>
                )}
            </VerticalStackContainer>
        </SideBar>
    );
}
