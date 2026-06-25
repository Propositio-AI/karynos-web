import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faCalendar, faClock, faYenSign } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type BasicInfoCardsProps = {
	salary: number;
	holiday: number;
	endTime: string;
	overtimeHours: number;
};

const InfoCard = ({
	title,
	value,
	icon,
}: {
	title: string;
	value: string;
	icon: IconDefinition;
}) => (
	<div className="rounded-lg border border-line bg-surface p-4 shadow-soft">
		<div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
			<FontAwesomeIcon icon={icon} className="h-4 w-4" />
		</div>
		<p className="text-xs font-bold text-subtle">{title}</p>
		<p className="mt-1 text-lg font-extrabold text-ink">{value}</p>
	</div>
);

export const BasicInfoCards = ({
	salary,
	holiday,
	endTime,
	overtimeHours,
}: BasicInfoCardsProps) => {
	const salaryMan = salary > 10000 ? Math.round(salary / 10000) : salary;
	const formattedEndTime = endTime.includes("T")
		? (endTime.split("T")[1]?.slice(0, 5) ?? endTime)
		: endTime;

	return (
		<section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
			<InfoCard title="年収" icon={faYenSign} value={`${salaryMan}万円`} />
			<InfoCard title="年間休日" icon={faCalendar} value={`${holiday}日`} />
			<InfoCard title="終業時刻" icon={faClock} value={formattedEndTime} />
			<InfoCard title="残業時間" icon={faBriefcase} value={`${overtimeHours}時間/月`} />
		</section>
	);
};
