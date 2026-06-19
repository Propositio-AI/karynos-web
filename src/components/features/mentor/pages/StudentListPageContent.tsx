"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BreadCrumb, Tag } from "@/components/ui/atoms/Text";
import { StudentInClass } from "@/types/feature/mentor/class";
import { getStudentsInClass, getClassById } from "@/lib/api/gen/mentor/classes";

type Props = {
    classId: string;
};

export default function StudentListPageContent({ classId }: Props) {
    const [students, setStudents] = useState<StudentInClass[]>([]);
    const [className, setClassName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const load = () => {
        setLoading(true);
        setError(null);
        Promise.all([getClassById(classId), getStudentsInClass(classId)])
            .then(([cls, studs]) => {
                setClassName(cls.name);
                setStudents(studs);
            })
            .catch(() => setError("生徒情報の読み込みに失敗しました。"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [classId]);

    const filtered = useMemo(
        () => students.filter((s) => s.name.includes(search) || s.studentNumber.includes(search)),
        [students, search]
    );

    const tagColors: Record<number, "blue" | "purple" | "green" | "orange"> = {
        0: "blue",
        1: "purple",
    };

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                <BreadCrumb
                    links={[
                        { name: "クラス管理", link: "/mentor/classes" },
                        { name: className || classId, link: `/mentor/classes/${classId}` },
                        { name: "履修生徒管理", link: "" },
                    ]}
                />
                <h1>履修生徒管理</h1>

                <HorizontalStackContainer space={2}>
                    <div className="relative flex-1">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="氏名・学籍番号で検索"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </HorizontalStackContainer>

                {loading ? (
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-14 bg-zinc-100 rounded animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <button className="mt-2 text-sm text-blue-500 underline" onClick={load}>再試行</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-100">
                                <tr>
                                    {["氏名", "学籍番号", "学年/組", "最終ログイン", "関心傾向タグ"].map((t) => (
                                        <th key={t} className="text-left p-3 font-semibold text-zinc-600">
                                            {t}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-zinc-400">
                                            {search ? "検索結果がありません" : "生徒が登録されていません"}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((s) => (
                                        <tr
                                            key={s.id}
                                            className="bg-white hover:bg-blue-50 cursor-pointer border-b border-zinc-100 transition-colors"
                                        >
                                            <td className="p-3">
                                                <Link href={`/mentor/classes/${classId}/students/${s.id}`}>
                                                    <HorizontalStackContainer space={2}>
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                            <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <span className="font-medium text-slate-800 hover:text-blue-600">
                                                            {s.name}
                                                        </span>
                                                    </HorizontalStackContainer>
                                                </Link>
                                            </td>
                                            <td className="p-3 text-zinc-600">{s.studentNumber}</td>
                                            <td className="p-3 text-zinc-600">{s.grade} {s.className}</td>
                                            <td className="p-3 text-zinc-500">
                                                {s.lastLoginAt ?? "未ログイン"}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {s.dreamMatchResults?.interestTags.slice(0, 2).map((tag, i) => (
                                                        <Tag key={tag} text={tag} color={tagColors[i] ?? "blue"} />
                                                    )) ?? (
                                                        <span className="text-zinc-400 text-xs">未設定</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </VerticalStackContainer>
        </SideBar>
    );
}
