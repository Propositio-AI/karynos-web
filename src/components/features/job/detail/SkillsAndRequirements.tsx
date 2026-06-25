import { Card } from "@/components/ui/molecules/Card";
import { Tag } from "@/components/ui/atoms/Text";
import type { Certification, Interest, Skill, Talent } from "@/lib/api/gen/schema";
import type { TagColor } from "@/types/ui/atoms/Text";

type RequirementCardProps = {
	title: string;
	items: Array<{ id: number; name: string; isRequired: boolean }>;
	requiredColor: TagColor;
	optionalColor: TagColor;
};

const RequirementCard = ({ title, items, requiredColor, optionalColor }: RequirementCardProps) => (
	<Card className="p-5 sm:p-6">
		<h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
		<div className="flex flex-wrap">
			{items.map((item) => (
				<Tag
					key={item.id}
					text={item.name}
					color={item.isRequired ? requiredColor : optionalColor}
					href={`/job/search?q=${encodeURIComponent(item.name)}`}
				/>
			))}
		</div>
	</Card>
);

type SkillsAndRequirementsProps = {
	skills: Skill[];
	certifications: Certification[];
	talents: Talent[];
	interests: Interest[];
};

export const SkillsAndRequirements = ({
	skills,
	certifications,
	talents,
	interests,
}: SkillsAndRequirementsProps) => {
	const skillItems = skills.map((s) => ({
		id: s.skill_id,
		name: s.name,
		isRequired: s.is_required,
	}));
	const certItems = certifications.map((c) => ({
		id: c.certification_id,
		name: c.name,
		isRequired: c.is_required,
	}));
	const talentItems = talents.map((t) => ({
		id: t.talent_id,
		name: t.name,
		isRequired: t.is_required,
	}));
	const interestItems = interests.map((i) => ({
		id: i.interest_id,
		name: i.name,
		isRequired: i.is_required,
	}));

	return (
		<section className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<RequirementCard
				title="必要なスキル"
				items={skillItems}
				requiredColor="red"
				optionalColor="blue"
			/>
			<RequirementCard
				title="関連資格"
				items={certItems}
				requiredColor="red"
				optionalColor="green"
			/>
			<RequirementCard
				title="求められる才能"
				items={talentItems}
				requiredColor="red"
				optionalColor="purple"
			/>
			<RequirementCard
				title="関連する興味分野"
				items={interestItems}
				requiredColor="red"
				optionalColor="orange"
			/>
		</section>
	);
};
