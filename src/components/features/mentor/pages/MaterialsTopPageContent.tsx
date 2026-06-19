"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer } from "@/components/ui/molecules/Container";
import { ClassItem } from "@/types/feature/mentor/class";
import { MaterialFolder } from "@/types/feature/mentor/material";
import { getClasses } from "@/lib/api/gen/mentor/classes";
import { getMaterialFolders } from "@/lib/api/gen/mentor/materials";

type ClassWithFolders = { cls: ClassItem; folders: MaterialFolder[] };

export default function MaterialsTopPageContent() {
    const [data, setData] = useState<ClassWithFolders[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        setError(null);
        getClasses()
            .then(async (classes) => {
                const results = await Promise.all(
                    classes.map(async (cls) => {
                        const folders = await getMaterialFolders(cls.id);
                        return { cls, folders };
                    })
                );
                setData(results);
            })
            .catch(() => setError("授業資料の読み込みに失敗しました。"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                <h1>授業資料</h1>
                <p className="text-zinc-500 -mt-4">
                    クラスごとの授業資料フォルダを管理します。資料はDream Actionの補助教材生成に使用されます。
                </p>

                {loading ? (
                    <VerticalStackContainer space={4}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-zinc-100 rounded-lg animate-pulse" />
                        ))}
                    </VerticalStackContainer>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <button className="mt-2 text-sm text-blue-500 underline" onClick={load}>再試行</button>
                    </div>
                ) : (
                    <VerticalStackContainer space={8}>
                        {data.map(({ cls, folders }) => (
                            <div key={cls.id} className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border-b border-zinc-200">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{cls.name}</h3>
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                            {folders.length}フォルダ
                                        </p>
                                    </div>
                                    <Link
                                        href={`/mentor/classes/${cls.id}/materials`}
                                        className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-700 font-medium"
                                    >
                                        フォルダを管理
                                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                                    </Link>
                                </div>
                                {folders.length === 0 ? (
                                    <div className="p-6 text-center text-zinc-400 text-sm">
                                        フォルダがまだありません
                                    </div>
                                ) : (
                                    <div className="divide-y divide-zinc-100">
                                        {folders.map((folder) => (
                                            <Link
                                                key={folder.id}
                                                href={`/mentor/classes/${cls.id}/materials`}
                                                className="flex items-center gap-3 px-6 py-3 hover:bg-blue-50 transition-colors"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faFolderOpen}
                                                    className="w-4 h-4 text-yellow-500"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-700">
                                                        {folder.name}
                                                    </p>
                                                    <p className="text-xs text-zinc-400">
                                                        {folder.subject} · {folder.fileCount}ファイル
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </VerticalStackContainer>
                )}
            </VerticalStackContainer>
        </SideBar>
    );
}
