"use client";

import { SideBar } from "@/components/ui/templates/SideBar";
import {
	VerticalStackContainer,
	HorizontalStackContainer,
} from "@/components/ui/molecules/Container";
import { BaseButton } from "@/components/ui/atoms/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { BaseInputText } from "@/components/ui/atoms/Input";

const DreamerGroupEdit = () => {
	return (
		<SideBar>
			<VerticalStackContainer space={8}>
				{/* Breadcrumb */}
				<HorizontalStackContainer space={2} className="items-center">
					<Link href="/mentor/dreamer/group" className="text-muted text-sm">
						グループ管理
					</Link>
					<FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-muted" />
					<Link href="/mentor/dreamer/group/detail/1" className="text-muted text-sm">
						3年A組
					</Link>
					<FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-muted" />
					<p className="text-blue-500 text-sm font-semibold">編集</p>
				</HorizontalStackContainer>

				<div className="bg-surface border border-line rounded-(--radius-md)">
					<div className="bg-canvas p-8 border-b border-line">
						<h1 className="text-2xl font-bold text-ink">Dreamer Groupを編集</h1>
					</div>
					<VerticalStackContainer space={8} className="p-8">
						<VerticalStackContainer space={4}>
							<h2 className="text-lg font-semibold text-ink">基本情報</h2>
							<VerticalStackContainer space={2} className="flex-1">
								<label className="font-medium text-sm text-ink">グループ名 *</label>
								<BaseInputText value="3年A組" />
							</VerticalStackContainer>
							<VerticalStackContainer space={2} className="flex-1">
								<label className="font-medium text-sm text-ink">説明</label>
								<textarea
									className="bg-canvas border border-line text-ink text-sm rounded-(--radius-sm) focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 w-full h-40"
									defaultValue="3年A組（進学コース）"
								/>
							</VerticalStackContainer>
						</VerticalStackContainer>
					</VerticalStackContainer>
					<div className="bg-canvas p-4 flex justify-center gap-4 border-t border-line">
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
};

export default DreamerGroupEdit;
