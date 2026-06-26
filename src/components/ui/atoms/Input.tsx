import { BaseInputTextType } from "@/types/ui/atoms/Input";
import { VerticalStackContainer } from "../molecules/Container";

export const BaseInputText = ({
	value,
	placeholder,
	className = "",
	label = "",
	type = "text",
	onChange,
}: BaseInputTextType) => {
	return (
		<VerticalStackContainer space={2} className="flex-1">
			{label !== "" && <label className="text-sm font-semibold text-ink">{label}</label>}
			<input
				type={type}
				className={`rounded-(--radius-sm) border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-subtle focus:border-brand-600 focus:ring-2 focus:ring-brand-100 ${className}`}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
			/>
		</VerticalStackContainer>
	);
};

export const BaseTextArea = ({
	value,
	placeholder,
	className = "",
	label = "",
	onChange,
}: BaseInputTextType) => {
	return (
		<VerticalStackContainer space={2} className="flex-1">
			{label !== "" && <label className="text-sm font-semibold text-ink">{label}</label>}
			<textarea
				className={`min-h-28 rounded-(--radius-sm) border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-subtle focus:border-brand-600 focus:ring-2 focus:ring-brand-100 ${className}`}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
			/>
		</VerticalStackContainer>
	);
};
