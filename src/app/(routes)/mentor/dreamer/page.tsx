"use client"

import { GridContainer, VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container"
import { SideBar } from "@/components/ui/templates/SideBar"
import { BaseInputText } from "@/components/ui/atoms/Input"
import { BaseButton, IconButton } from "@/components/ui/atoms/Button"
import { DreamerListItem } from "@/components/ui/atoms/Text"

import { faPlus, faDownload } from "@fortawesome/free-solid-svg-icons"
import { MentorDashboardCard } from "@/components/ui/molecules/Card"

const DreamerAdmin = () => {

    return( 
        <SideBar>
            <VerticalStackContainer space={8}>
                <span>
                    <h1>Dreamer 管理</h1>
                    <p className="text-zinc-500">Dreamerアカウントの管理を行います。</p>
                </span>
                <GridContainer minWidth={200}>
                    {/* Card */}
                    <MentorDashboardCard title="Dreamer 数">
                        <h1>248</h1>
                    </MentorDashboardCard>
                    <MentorDashboardCard title="平均使用時間">
                        <h1>26</h1>
                    </MentorDashboardCard>
                </GridContainer>

                <HorizontalStackContainer space={4}>
                    <BaseInputText placeholder="Dreamerを検索" className="w-full"/>
                    <IconButton color="blue" icon={faPlus} className="w-60 font-semibold">
                        <p className="text-center w-full">
                            Dreamerを追加
                        </p>
                    </IconButton>
                </HorizontalStackContainer>

                {/* Table Action */}
                <span>
                    <HorizontalStackContainer space={4} className="w-full bg-zinc-100 px-4">
                        <p className="font-medium">Dreamer一覧</p>
                        <IconButton icon={faDownload} className="">CSV一括</IconButton>
                    </HorizontalStackContainer>
                    <table className="w-full">
                        <thead className="bg-zinc-200">
                            <tr>
                                <th className="text-left p-2">名前</th>
                                <th className="text-left p-2">学籍番号</th>
                                <th className="text-left p-2">グループ</th>
                                <th className="text-left p-2">最終ログイン</th>
                                <th className="text-left p-2">作成日</th>
                            </tr>
                        </thead>
                        <tbody>
                            <DreamerListItem name="山田太郎" student_num="ST001" group={[{label: "グループA", id: "1"}, {label: "グループB", id: "2"}]} login_at="2024/01/01 12:00" created_at="2023/12/01 09:00"/>
                            <DreamerListItem name="山田太郎" student_num="ST001" group={[{label: "グループA", id: "1"}, {label: "グループB", id: "2"}]} login_at="2024/01/01 12:00" created_at="2023/12/01 09:00"/>
                            <DreamerListItem name="山田太郎" student_num="ST001" group={[{label: "グループA", id: "1"}, {label: "グループB", id: "2"}]} login_at="2024/01/01 12:00" created_at="2023/12/01 09:00"/>
                            <DreamerListItem name="山田太郎" student_num="ST001" group={[{label: "グループA", id: "1"}, {label: "グループB", id: "2"}]} login_at="2024/01/01 12:00" created_at="2023/12/01 09:00"/>
                        </tbody>
                    </table>
                </span>
            </VerticalStackContainer>
        </SideBar>
   )
}

export default DreamerAdmin