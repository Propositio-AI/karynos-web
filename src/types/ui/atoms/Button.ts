import { ColorVariantKey } from "../color";

export type BaseButtonType = {
	color?: ColorVariantKey;
	children?: React.ReactNode;
	className?: string;
	isLoading?: boolean;
	onClick?: () => void;
};

export type NavType = "match" | "explore" | "home" | "map" | "setting";
