"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BreadCrumb, Tag } from "@/components/ui/atoms/Text";
import { ProfileText } from "@/components/features/mentor/Text";
import { StudentInClass } from "@/types/feature/mentor/class";
import { getStudentById, getClassById } from "@/lib/api/gen/mentor/classes";

type Props = {
    classId: string;
    studentId: string;
};

const medalColors = ["text-yellow-500", "text-zinc-400", "text-amber-600"];
const tagColorList = ["blue", "purple", "green", "orange", "yellow", "red"] as const;

export default function StudentDetailPageContent({ classId, studentId }: Props) {
    const [student, setStudent] = useState<StudentInClass | null>(null);
    const [className, setClassName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getStudentById(classId, studentId), getClassById(classId)])
            .then(([s, cls]) => {
                setStudent(s);
                setClassName(cls.name);
            })
            .catch(() => setError("生徒情報の読み込みに失敗しました。"))
            .finally(() => setLoading(false));
    }, [studentId, classId]);

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                <BreadCrumb
                    links={[
                        { name: "クラス管理", link: "/mentor/classes" },
                        { name: className || classId, link: `/mentor/classes/${classId}` },
                        { name: "履修生徒管理", link: `/mentor/classes/${classId}/students` },
                        { name: student?.name ?? studentId, link: "" },
                    ]}
                />

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-32 bg-zinc-100 rounded-lg" />
                        <div className="h-48 bg-zinc-100 rounded-lg" />
                    </div>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : student ? (
                    <>
                        {/* プロフィールカード */}
                        <div className="bg-white border border-zinc-200 rounded-lg p-8">
                            <HorizontalStackContainer space={4} className="mb-6">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-blue-500" />
                                </div>
                                <div>
                                    <h2>{student.name}</h2>
                                    <div className="flex gap-2 mt-1">
                                        <Tag text={student.grade} color="green" />
                                        <Tag text={student.className} color="blue" />
                                    </div>
                                </div>
                            </HorizontalStackContainer>
                            <table className="w-full table-fixed">
                                <tbody>
                                    <tr>
                                        <td className="p-3">
                                            <ProfileText title="学籍番号" text={student.studentNumber} />
                                        </td>
                                        <td className="p-3">
                                            <ProfileText
                                                title="最終ログイン日"
                                                text={student.lastLoginAt ?? "未ログイン"}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-3">
                                            <ProfileText title="学年" text={student.grade} />
                                        </td>
                                        <td className="p-3">
                                            <ProfileText
                                                title="アカウント作成日"
                                                text={student.createdAt}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 将来への興味の傾向 */}
                        <div className="bg-white border border-zinc-200 rounded-lg p-8">
                            <h3 className="mb-1">将来への興味の傾向</h3>
                            <p className="text-xs text-zinc-400 mb-6">
                                Dream Matchingの結果に基づく関心傾向
                            </p>

                            {student.dreamMatchResults ? (
                                <VerticalStackContainer space={8}>
                                    {/* 関心タグ */}
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-600 mb-3">関心キーワード</p>
                                        <div className="flex flex-wrap">
                                            {student.dreamMatchResults.interestTags.map((tag, i) => (
                                                <Tag
                                                    key={tag}
                                                    text={tag}
                                                    color={tagColorList[i % tagColorList.length] as typeof tagColorList[number]}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* 人気職種カテゴリ */}
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-600 mb-3">
                                            関心の高い職種カテゴリ
                                        </p>
                                        <VerticalStackContainer space={2}>
                                            {student.dreamMatchResults.topJobCategories.map((cat) => (
                                                <div key={cat.name} className="flex items-center gap-3">
                                                    <span className="text-sm text-zinc-700 w-40 shrink-0">
                                                        {cat.name}
                                                    </span>
                                                    <div className="flex-1 bg-zinc-100 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${Math.min(100, (cat.count / 20) * 100)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-zinc-500 w-8 text-right">
                                                        {cat.count}
                                                    </span>
                                                </div>
                                            ))}
                                        </VerticalStackContainer>
                                    </div>

                                    {/* マッチした職業ランキング */}
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-600 mb-3">
                                            マッチした職業 Top3
                                        </p>
                                        <VerticalStackContainer space={2}>
                                            {student.dreamMatchResults.matchedJobs.slice(0, 3).map((job, i) => (
                                                <div
                                                    key={job.id}
                                                    className="flex items-center gap-4 bg-zinc-50 border border-zinc-200 rounded-lg p-4"
                                                >
                                                    <div className={`text-xl font-black ${medalColors[i]}`}>
                                                        <FontAwesomeIcon icon={faTrophy} className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-slate-800">{job.name}</p>
                                                        <p className="text-xs text-zinc-400">
                                                            マッチ度 {job.score}%
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="text-lg font-black"
                                                        style={{
                                                            color: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : "#b45309",
                                                        }}
                                                    >
                                                        #{i + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </VerticalStackContainer>
                                    </div>
                                </VerticalStackContainer>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-zinc-400">Dream Matchingの結果がまだありません</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </VerticalStackContainer>
        </SideBar>
    );
}
