"use client";

import { useState } from "react";
import { SideBar } from "@/components/ui/templates/SideBar";
import {
	VerticalStackContainer,
	HorizontalStackContainer,
} from "@/components/ui/molecules/Container";
import { BaseButton } from "@/components/ui/atoms/Button";
import { DreamerForm } from "@/components/features/mentor/Form";
import { BreadCrumb } from "@/components/ui/atoms/Text";

export default function NewDreamerPageContent() {
	const [mode] = useState<"single" | "bulk">("single");

	return (
		<SideBar>
			<VerticalStackContainer space={8} className="h-full">
				<BreadCrumb
					links={[
						{
							name: "Dreamer管理",
							link: "",
						},
						{
							name: "新規作成",
							link: "",
						},
					]}
				/>

				<h1>Dreamerアカウント 作成</h1>

				{mode === "single" ? <DreamerForm /> : <></>}

				<HorizontalStackContainer space={8} className="mx-auto">
					<BaseButton color="white" className="rounded-full! px-8">
						キャンセル
					</BaseButton>
					<BaseButton color="blue" className="rounded-full! px-8">
						アカウントを追加
					</BaseButton>
				</HorizontalStackContainer>
			</VerticalStackContainer>
		</SideBar>
	);
}
