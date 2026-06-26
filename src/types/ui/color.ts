export type ColorVariantKey = "slate" | "white" | "emerald" | "blue";

export const ColorVariants: Record<ColorVariantKey, string> = {
	slate: "bg-slate",
	white: "bg-white",
	emerald: "bg-emerald",
	blue: "bg-blue",
};

export const LoadingColorVariants: Record<ColorVariantKey, string> = {
	slate: "border-white",
	white: "border-black",
	emerald: "border-white",
	blue: "border-white",
};
