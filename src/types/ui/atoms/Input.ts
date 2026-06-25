import type { ChangeEvent } from "react";

export type BaseInputTextType = {
	type?: "number" | "text" | "password" | "email";
	value?: string;
	placeholder?: string;
	className?: string;
	label?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};
