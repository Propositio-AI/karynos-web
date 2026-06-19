"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faFolderOpen, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BreadCrumb } from "@/components/ui/atoms/Text";
import { ClassItem } from "@/types/feature/mentor/class";
import { getClassById } from "@/lib/api/gen/mentor/classes";

type Props = {
    classId: string;
};

export default function ClassDetailPageContent({ classId }: Props) {
    const [cls, setCls] = useState<ClassItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getClassById(classId)
            .then(setCls)
            .catch(() => setError("クラス情報の読み込みに失敗しました。"))
            .finally(() => setLoading(false));
    }, [classId]);

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                <BreadCrumb
                    links={[
                        { name: "クラス管理", link: "/mentor/classes" },
                        { name: cls?.name ?? classId, link: "" },
                    ]}
                />

                {loading ? (
                    <div className="animate-pulse">
                        <div className="h-8 bg-zinc-200 rounded w-1/4 mb-4" />
                        <div className="h-4 bg-zinc-100 rounded w-1/6" />
                    </div>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : cls ? (
                    <>
                        <div className="bg-white border border-zinc-200 rounded-lg p-8">
                            <h1 className="text-2xl font-black text-slate-800">{cls.name}</h1>
                            {cls.description && (
                                <p className="text-sm text-zinc-500 mt-1">{cls.description}</p>
                            )}
                            <div className="flex items-center gap-6 mt-4 text-sm text-zinc-600">
                                <span className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
                                    {cls.studentCount}名
                                </span>
                                <span>学年: {cls.grade}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href={`/mentor/classes/${classId}/students`}>
                                <div className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer">
                                    <HorizontalStackContainer className="justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">履修生徒管理</h3>
                                                <p className="text-sm text-zinc-500 mt-1">
                                                    生徒一覧・詳細・関心傾向の確認
                                                </p>
                                            </div>
                                        </div>
                                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-zinc-400" />
                                    </HorizontalStackContainer>
                                </div>
                            </Link>

                            <Link href={`/mentor/classes/${classId}/materials`}>
                                <div className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer">
                                    <HorizontalStackContainer className="justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faFolderOpen} className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">授業資料フォルダ</h3>
                                                <p className="text-sm text-zinc-500 mt-1">
                                                    授業資料のアップロード・管理
                                                </p>
                                            </div>
                                        </div>
                                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-zinc-400" />
                                    </HorizontalStackContainer>
                                </div>
                            </Link>
                        </div>
                    </>
                ) : null}
            </VerticalStackContainer>
        </SideBar>
    );
}
