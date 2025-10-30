"use client"

import { useState } from "react";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BaseButton, IconButton } from "@/components/ui/atoms/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { BaseInputText } from "@/components/ui/atoms/Input";
import { TagSelect } from "@/components/ui/molecules/TagSelect";
import { ModeToggle } from "@/components/ui/molecules/ModeToggle";

const NewDreamer = () => {
    const [mode, setMode] = useState<'single' | 'bulk'>('single');

    return (
        <SideBar>
            <VerticalStackContainer space={8} className="h-full">
                {/* Breadcrumb */}
                <HorizontalStackContainer space={2} className="items-center">
                    <Link href="/mentor/dreamer" className="text-zinc-500 text-sm">
                        Dreamer管理
                    </Link>
                    <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-zinc-500" />
                    <p className="text-blue-500 text-sm font-semibold">新規作成</p>
                </HorizontalStackContainer>

                <div className="bg-white border border-slate-200 rounded-lg flex-1 flex flex-col">
                    <div className="bg-zinc-100 p-8 border-b border-slate-200 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Dreamerアカウント作成</h1>
                            <p className="text-zinc-500">新しい生徒アカウントを作成します</p>
                        </div>
                        <ModeToggle onToggle={setMode} />
                    </div>
                    <VerticalStackContainer space={8} className="p-8 flex-1">
                        {mode === 'single' ? (
                            <>
                                <VerticalStackContainer space={4}>
                                    <h2 className="text-lg font-semibold text-slate-800">基本情報</h2>
                                    <HorizontalStackContainer space={4}>
                                        <VerticalStackContainer space={2} className="flex-1">
                                            <label className="font-medium text-sm text-slate-800">姓 *</label>
                                            <BaseInputText placeholder="山田" />
                                        </VerticalStackContainer>
                                        <VerticalStackContainer space={2} className="flex-1">
                                            <label className="font-medium text-sm text-slate-800">名 *</label>
                                            <BaseInputText placeholder="太郎" />
                                        </VerticalStackContainer>
                                    </HorizontalStackContainer>
                                    <HorizontalStackContainer space={4}>
                                        <VerticalStackContainer space={2} className="flex-1">
                                            <label className="font-medium text-sm text-slate-800">学籍番号 *</label>
                                            <BaseInputText placeholder="ST001" />
                                        </VerticalStackContainer>
                                        <VerticalStackContainer space={2} className="flex-1">
                                            <label className="font-medium text-sm text-slate-800">入学年度</label>
                                            <BaseInputText placeholder="選択してください" />
                                        </VerticalStackContainer>
                                    </HorizontalStackContainer>
                                    <TagSelect />
                                </VerticalStackContainer>

                                <VerticalStackContainer space={4}>
                                    <h2 className="text-lg font-semibold text-slate-800">アカウント設定</h2>
                                    <VerticalStackContainer space={2}>
                                        <label className="font-medium text-sm text-slate-800">初期パスワード</label>
                                        <BaseInputText value="123456abc" />
                                    </VerticalStackContainer>
                                </VerticalStackContainer>
                            </>
                        ) : (
                            <VerticalStackContainer space={4}>
                            </VerticalStackContainer>
                        )}
                    </VerticalStackContainer>
                    <div className="bg-zinc-100 p-4 flex justify-center gap-4 border-t border-slate-200">
                        <BaseButton color="white" className="rounded-full! px-8">キャンセル</BaseButton>
                        <IconButton icon={faPlus} color="blue" className="rounded-full! px-8 font-semibold">
                            アカウントを追加
                        </IconButton>
                    </div>
                </div>
            </VerticalStackContainer>
        </SideBar>
    )
}

export default NewDreamer;