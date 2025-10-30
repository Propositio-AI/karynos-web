"use client"

import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BaseButton } from "@/components/ui/atoms/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const DreamerDetail = () => {

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                {/* Breadcrumb */}
                <HorizontalStackContainer space={2} className="items-center">
                    <Link href="/mentor/dreamer" className="text-zinc-500 text-sm">
                        Dreamer管理
                    </Link>
                    <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-zinc-500" />
                    <p className="text-blue-500 text-sm font-semibold">山田太郎</p>
                </HorizontalStackContainer>

                <div className="flex gap-8">
                    {/* Left Panel */}
                    <VerticalStackContainer className="flex-1" space={4}>
                        <div className="bg-white border border-slate-200 rounded-lg">
                            {/* Profile Header */}
                            <div className="flex items-center gap-6 p-8">
                                <img alt="User Icon" src="https://www.figma.com/api/mcp/asset/6ee632ba-ade1-40f4-ae60-7d8c9991cbd1" className="w-14 h-14" />
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-slate-800">山田太郎</h1>
                                    <HorizontalStackContainer space={2} className="mt-2">
                                        <span className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-medium px-3 py-1 rounded-full">3年</span>
                                        <span className="bg-green-100 border border-green-500 text-green-800 text-xs font-medium px-3 py-1 rounded-full">3年A組</span>
                                    </HorizontalStackContainer>
                                </div>
                                <BaseButton color="white" className="!rounded-4xl px-6 !text-s">編集</BaseButton>
                            </div>
                            {/* Profile Details */}
                            <div className="p-8 border-t border-slate-200">
                                <div className="grid grid-cols-2 gap-8">
                                    <VerticalStackContainer space={4}>
                                        <div>
                                            <p className="text-sm text-zinc-500">学籍番号</p>
                                            <p className="text-base font-semibold text-slate-800">ST001</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-500">入学年度</p>
                                            <p className="text-base font-semibold text-slate-800">2023年度</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-500">アカウント作成日</p>
                                            <p className="text-base font-semibold text-slate-800">2023年4月1日</p>
                                        </div>
                                    </VerticalStackContainer>
                                    <VerticalStackContainer space={4}>
                                        <div>
                                            <p className="text-sm text-zinc-500">最終ログイン</p>
                                            <p className="text-base font-semibold text-slate-800">2024年1月15日 14:30</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-500">終了タスク数</p>
                                            <p className="text-base font-semibold text-slate-800">12個</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-500">総使用時間</p>
                                            <p className="text-base font-semibold text-slate-800">48時間30分</p>
                                        </div>
                                    </VerticalStackContainer>
                                </div>
                            </div>
                        </div>
                    </VerticalStackContainer>
                </div>
            </VerticalStackContainer>
        </SideBar>
    )
}

export default DreamerDetail