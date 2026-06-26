import { Card } from "@/components/ui/molecules/Card";

type InfoSectionProps = {
	title: string;
	content: string;
	preserveWhitespace?: boolean;
};

export const InfoSection = ({ title, content, preserveWhitespace = false }: InfoSectionProps) => {
	return (
		<Card className="mb-5 p-5 sm:p-6">
			<h2 className="text-xl font-bold text-ink">{title}</h2>
			<p
				className={`mt-3 text-sm leading-7 text-muted ${preserveWhitespace ? "whitespace-pre-line" : ""}`}
			>
				{content}
			</p>
		</Card>
	);
};
