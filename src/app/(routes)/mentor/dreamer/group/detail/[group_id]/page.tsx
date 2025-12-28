"use client";

import { useState } from "react";
import { faEdit, faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import { SideBar } from "@/components/ui/templates/SideBar"
import { BaseButton, IconButton } from "@/components/ui/atoms/Button";
import { BaseInputText } from "@/components/ui/atoms/Input";
import { DreamerListItem, TableButton, TableHeader } from "@/features/mentor/Table";
import { Card } from "@/components/ui/molecules/Card";
import { SimpleModal } from "@/components/ui/molecules/Modal";
import { AddDreamerModal } from "@/components/ui/molecules/AddDreamerModal";
import { HorizontalStackContainer, VerticalStackContainer } from "@/components/ui/molecules/Container";
import { BreadCrumb } from "@/components/ui/atoms/Text";
import { ProfileText } from "@/features/mentor/Text";

const dummyDreamers = [
	{
		name: "山田太郎",
		studentId: "ST001",
		groups: ["3年", "3-1"],
		lastLogin: "2024/01/15 14:30",
		createdAt: "2023/04/01",
	},
	{
		name: "鈴木花子",
		studentId: "ST002",
		groups: ["3年", "3-1"],
		lastLogin: "2024/01/14 10:00",
		createdAt: "2023/04/01",
	},
	{
		name: "佐藤一郎",
		studentId: "ST003",
		groups: ["3年", "3-1"],
		lastLogin: "2024/01/15 09:30",
		createdAt: "2023/04/01",
	},
	{
		name: "田中次郎",
		studentId: "ST004",
		groups: ["3年", "3-1"],
		lastLogin: "2024/01/13 18:00",
		createdAt: "2023/04/01",
	},
];

export default function DreamerGroupDetailPage({
	params,
	}: {
	params: { group_id: string };
	}) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<SideBar>
			
			<div className="bg-slate-100 p-8 flex-1">
				<BreadCrumb links = {[
					{
						name: "グループ管理",
						link: ""
					},
					{
						name: "3年A組",
						link: ""
					}
				]}/>
				
				<VerticalStackContainer className="flex-1 bg-white border border-slate-200 rounded-lg" space={4}>
					<HorizontalStackContainer className="w-full p-8">
						<img alt="User Icon" src="https://www.figma.com/api/mcp/asset/6ee632ba-ade1-40f4-ae60-7d8c9991cbd1" className="w-14 h-14" />
						<h3 className="w-full">3年A組</h3>

						<IconButton icon={faEdit} className="w-30">
							編集
						</IconButton>
					</HorizontalStackContainer>

					<table className="w-full m-8 table-fixed">
						<tbody>
							<tr>
								<td className="p-3">
									<ProfileText title="Dreamer数" text="6"/>
								</td>
								<td className="p-3">
									<ProfileText title="説明" text="３年A組（進学コース）"/>
								</td>
							</tr>
							<tr>
								<td className="p-3">
									<ProfileText title="アカウント作成日" text="2023年4月1日"/>
								</td>
								<td className="p-3">
									<ProfileText title="平均利用時間（1日）" text="1時間"/>
								</td>
							</tr>
							<tr>
								<td className="p-3">
									<ProfileText title="総使用時間" text="48時間30分"/>
								</td>
							</tr>
						</tbody>
					</table>
				</VerticalStackContainer>

				<TableButton/>

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
					<TableHeader
						titleList = {["氏名", "学籍番号", "グループ", "最終ログイン日", "作成日時"]}
					/>
					<tbody>
						{dummyDreamers.map((dreamer, index) => (
						<DreamerListItem
							key={index}
							name={dreamer.name}
							student_num={dreamer.studentId}
							group={dreamer.groups.map((g, i) => ({ label: g, id: `${index}-${i}` }))}
							login_at={dreamer.lastLogin}
							created_at={dreamer.createdAt}
						/>
						))}
					</tbody>
					</table>
				</div>

				<SimpleModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				title="3年A組にDreamerを追加"
				className="w-full max-w-4xl"
				>
				<AddDreamerModal />
				</SimpleModal>
			</div>
		</SideBar>
	);
}
