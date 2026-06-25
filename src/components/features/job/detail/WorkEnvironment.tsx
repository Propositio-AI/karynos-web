import { Card } from "@/components/ui/molecules/Card";

type EnvironmentItemProps = {
	label: string;
	value: string | number;
};

const EnvironmentItem = ({ label, value }: EnvironmentItemProps) => (
	<div className="rounded-lg bg-stone-50 p-4">
		<p className="text-xs font-bold text-subtle">{label}</p>
		<p className="mt-1 text-lg font-extrabold text-ink">{value}</p>
	</div>
);

type WorkEnvironmentProps = {
	age: number;
	tenureYears: number;
	marriageAge: number;
	genderRatio: number;
	romanceRate: number;
	workLifeBalance: number;
	rarity: number;
};

export const WorkEnvironment = ({
	age,
	tenureYears,
	marriageAge,
	genderRatio,
	romanceRate,
	workLifeBalance,
	rarity,
}: WorkEnvironmentProps) => {
	return (
		<Card className="mb-5 p-5 sm:p-6">
			<h2 className="mb-4 text-xl font-bold text-ink">職場環境</h2>
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
				<EnvironmentItem label="平均年齢" value={`${age}歳`} />
				<EnvironmentItem label="平均勤続年数" value={`${tenureYears}年`} />
				<EnvironmentItem label="平均結婚年齢" value={`${marriageAge}歳`} />
				<EnvironmentItem label="男女比" value={`${(genderRatio * 100).toFixed(0)}%`} />
				<EnvironmentItem label="社内恋愛率" value={`${(romanceRate * 100).toFixed(0)}%`} />
				<EnvironmentItem label="ワークライフバランス" value={`${workLifeBalance}/10`} />
				<EnvironmentItem label="レア度" value={`${(rarity * 100).toFixed(0)}%`} />
			</div>
		</Card>
	);
};
