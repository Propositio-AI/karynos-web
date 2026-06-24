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
            {label !== "" && (
                <label className="text-sm font-bold text-ink">{label}</label>
            )}
            <input
                type={type}
                className={`rounded-lg border border-line bg-surface px-3 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-100 ${className}`}
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
            {label !== "" && (
                <label className="text-sm font-bold text-ink">{label}</label>
            )}
            <textarea
                className={`min-h-28 rounded-lg border border-line bg-surface px-3 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-100 ${className}`}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        </VerticalStackContainer>
    );
};
