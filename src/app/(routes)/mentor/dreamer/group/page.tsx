"use client";

import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, GridContainer } from "@/components/ui/molecules/Container";
import { DashboardCard } from "@/components/ui/molecules/Card";
import { IconButton } from "@/components/ui/atoms/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { GroupCard } from "@/components/features/mentor/Card";

import Link from "next/link";

const DreamerGroupAdmin = () => {
	const groups = [
		{ id: "1", name: "3年", memberCount: 160 },
		{ id: "2", name: "3年A組", memberCount: 40 },
		{ id: "3", name: "3年B組", memberCount: 40 },
		{ id: "4", name: "3年C組", memberCount: 40 },
		{ id: "5", name: "3年D組", memberCount: 40 },
	];

	return (
		<SideBar>
			<VerticalStackContainer space={8}>
				<h1>Dreamerグループ管理</h1>

				<div className="flex justify-end">
					<Link href="/mentor/dreamer/group/new">
						<IconButton
							icon={faPlus}
							color="blue"
							className="font-semibold !rounded-full px-4"
						>
							グループ追加
						</IconButton>
					</Link>
				</div>

				<GridContainer minWidth={300}>
					<DashboardCard title="グループ数" className="w-1/3 rounded-2xl">
						<h1 className="text-6xl font-bold">5</h1>
					</DashboardCard>
				</GridContainer>

				<GridContainer minWidth={300} className="gap-4">
					{groups.map((group) => (
						<GroupCard
							key={group.id}
							id={group.id}
							name={group.name}
							memberCount={group.memberCount}
						/>
					))}
				</GridContainer>
			</VerticalStackContainer>
		</SideBar>
	);
};

export default DreamerGroupAdmin;
