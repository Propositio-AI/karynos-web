"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { SideBar } from "@/components/ui/templates/SideBar";
import {
	VerticalStackContainer,
	HorizontalStackContainer,
} from "@/components/ui/molecules/Container";
import { BaseButton } from "@/components/ui/atoms/Button";
import { BaseInputText } from "@/components/ui/atoms/Input";

export default function DreamerGroupEditPageContent() {
	return (
		<SideBar>
			<VerticalStackContainer space={8}>
				<HorizontalStackContainer space={2} className="items-center">
					<Link href="/mentor/dreamer/group" className="text-zinc-500 text-sm">
						グループ管理
					</Link>
					<FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-zinc-500" />
					<Link href="/mentor/dreamer/group/detail/1" className="text-zinc-500 text-sm">
						3年A組
					</Link>
					<FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-zinc-500" />
					<p className="text-blue-500 text-sm font-semibold">編集</p>
				</HorizontalStackContainer>

				<div className="bg-white border border-slate-200 rounded-lg">
					<div className="bg-zinc-100 p-8 border-b border-slate-200">
						<h1 className="text-2xl font-bold text-slate-800">Dreamer Groupを編集</h1>
					</div>
					<VerticalStackContainer space={8} className="p-8">
						<VerticalStackContainer space={4}>
							<h2 className="text-lg font-semibold text-slate-800">基本情報</h2>
							<VerticalStackContainer space={2} className="flex-1">
								<label className="font-medium text-sm text-slate-800">
									グループ名 *
								</label>
								<BaseInputText value="3年A組" />
							</VerticalStackContainer>
							<VerticalStackContainer space={2} className="flex-1">
								<label className="font-medium text-sm text-slate-800">説明</label>
								<textarea
									className="bg-zinc-50 border border-zinc-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 w-full h-40"
									defaultValue="3年A組（進学コース）"
								/>
							</VerticalStackContainer>
						</VerticalStackContainer>
					</VerticalStackContainer>
					<div className="bg-zinc-100 p-4 flex justify-center gap-4 border-t border-slate-200">
						<BaseButton color="white" className="rounded-full! px-8">
							キャンセル
						</BaseButton>
						<BaseButton color="blue" className="rounded-full! px-8">
							保存
						</BaseButton>
					</div>
				</div>
			</VerticalStackContainer>
		</SideBar>
	);
}
