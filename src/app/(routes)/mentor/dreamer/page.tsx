"use client"

import { GridContainer, VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container"
import { SideBar } from "@/components/ui/templates/SideBar"
import { DreamerListItem } from "@/features/mentor/Table"

import { DashboardCard } from "@/components/ui/molecules/Card"
import { TableButton, TableHeader } from "@/features/mentor/Table"

const DreamerAdmin = () => {

    return( 
        <SideBar>
            <VerticalStackContainer space={8}>
                <h1>Dreamer 管理</h1>

                <GridContainer minWidth={200}>
                    <DashboardCard title="Dreamer数">
                        <h1>248</h1>
                    </DashboardCard>
                    <DashboardCard title="平均使用時間">
                        <h1>26</h1>
                    </DashboardCard>
                </GridContainer>

                <TableButton/>

                <HorizontalStackContainer className="my-2">
                    <h4>Dreamer一覧</h4>
                    {/* <IconButton icon={faDownload} className="">
                        CSV一括
                    </IconButton> */}
                </HorizontalStackContainer>

                <table className="w-full">
                    <TableHeader
                        titleList = {["氏名", "学籍番号", "グループ", "最終ログイン日", "作成日時"]}
                    />
                    <tbody>
                        <DreamerListItem name="山田太郎" student_num="ST001" group={[{label: "グループA", id: "1"}, {label: "グループB", id: "2"}]} login_at="2024/01/01 12:00" created_at="2023/12/01 09:00"/>
                        <DreamerListItem name="山田太郎" student_num="ST001" group={[{label: "グループA", id: "1"}, {label: "グループB", id: "2"}]} login_at="2024/01/01 12:00" created_at="2023/12/01 09:00"/>
                        <DreamerListItem name="山田太郎" student_num="ST001" group={[{label: "グループA", id: "1"}, {label: "グループB", id: "2"}]} login_at="2024/01/01 12:00" created_at="2023/12/01 09:00"/>
                        <DreamerListItem name="山田太郎" student_num="ST001" group={[{label: "グループA", id: "1"}, {label: "グループB", id: "2"}]} login_at="2024/01/01 12:00" created_at="2023/12/01 09:00"/>
                    </tbody>
                </table>
            </VerticalStackContainer>
        </SideBar>
   )
}

export default DreamerAdmin