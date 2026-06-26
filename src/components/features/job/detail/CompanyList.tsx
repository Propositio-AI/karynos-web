import { Card } from "@/components/ui/molecules/Card";
import { Tag } from "@/components/ui/atoms/Text";
import type { Company } from "@/lib/api/gen/schema";

type CompanyListProps = {
	companies: Company[];
};

export const CompanyList = ({ companies }: CompanyListProps) => {
	if (companies.length === 0) return null;

	return (
		<Card className="mb-5 p-5 sm:p-6">
			<h2 className="mb-4 text-xl font-bold text-ink">関連企業</h2>
			<div className="flex flex-wrap">
				{companies.map((company) => (
					<Tag key={company.company_id} text={company.name} color="slate" />
				))}
			</div>
		</Card>
	);
};
