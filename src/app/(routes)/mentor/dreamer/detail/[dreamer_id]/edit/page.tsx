"use client"

/*背景が謎にずれます*/

import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BaseButton, IconButton } from "@/components/ui/atoms/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { BaseInputText } from "@/components/ui/atoms/Input";
import { TagSelect } from "@/components/ui/molecules/TagSelect";

const DreamerEdit = () => {

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                {/* Breadcrumb */}
                <HorizontalStackContainer space={2} className="items-center">
                    <Link href="/mentor/dreamer" className="text-zinc-500 text-sm">
                        Dreamer管理
                    </Link>
                    <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-zinc-500" />
                    <Link href="/mentor/dreamer/detail/1" className="text-zinc-500 text-sm">
                        山田太郎
                    </Link>
                    <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-zinc-500" />
                    <p className="text-blue-500 text-sm font-semibold">編集</p>
                </HorizontalStackContainer>

                <div className="bg-white border border-slate-200 rounded-lg">
                    <div className="bg-zinc-100 p-8 border-b border-slate-200">
                        <h1 className="text-2xl font-bold text-slate-800">Dreamerアカウントを編集</h1>
                    </div>
                    <VerticalStackContainer space={8} className="p-8">
                        <VerticalStackContainer space={4}>
                            <h2 className="text-lg font-semibold text-slate-800">基本情報</h2>
                            <HorizontalStackContainer space={4}>
                                <VerticalStackContainer space={2} className="flex-1">
                                    <label className="font-medium text-sm text-slate-800">姓 *</label>
                                    <BaseInputText value="山田" />
                                </VerticalStackContainer>
                                <VerticalStackContainer space={2} className="flex-1">
                                    <label className="font-medium text-sm text-slate-800">名 *</label>
                                    <BaseInputText value="太郎" />
                                </VerticalStackContainer>
                            </HorizontalStackContainer>
                            <HorizontalStackContainer space={4}>
                                <VerticalStackContainer space={2} className="flex-1">
                                    <label className="font-medium text-sm text-slate-800">学籍番号 *</label>
                                    <BaseInputText value="ST001" />
                                </VerticalStackContainer>
                                <VerticalStackContainer space={2} className="flex-1">
                                    <label className="font-medium text-sm text-slate-800">入学年度</label>
                                    <BaseInputText value="2023年度" />
                                </VerticalStackContainer>
                            </HorizontalStackContainer>
                            <TagSelect />
                            <IconButton icon={faPlus} color="blue" className="px-4 w-fit font-semibold !rounded-full text-sm">
                                グループ追加
                            </IconButton>
                        </VerticalStackContainer>

                        <VerticalStackContainer space={4}>
                            <h2 className="text-lg font-semibold text-slate-800">アカウント設定</h2>
                            <VerticalStackContainer space={2}>
                                <label className="font-medium text-sm text-slate-800">初期化パスワード</label>
                                <BaseInputText value="123456abc" />
                            </VerticalStackContainer>
                        </VerticalStackContainer>
                    </VerticalStackContainer>
                    <div className="bg-zinc-100 p-4 flex justify-center gap-4 border-t border-slate-200">
                        <BaseButton color="white" className="rounded-full! px-8">キャンセル</BaseButton>
                        <BaseButton color="blue" className="rounded-full! px-8">保存</BaseButton>
                    </div>
                </div>
            </VerticalStackContainer>
        </SideBar>
    )
}

export default DreamerEdit;
