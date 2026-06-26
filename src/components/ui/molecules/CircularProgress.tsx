"use client";

import { useEffect, useState } from "react";

interface CircularProgressProps {
	value: number;
	max?: number;
	unit?: string;
	label?: string;
	size?: number;
	strokeWidth?: number;
	color?: string;
	animation?: boolean;
}

export const CircularProgress = ({
	value = 60,
	max = 100,
	unit = "%",
	label = "スコア",
	size = 100,
	strokeWidth = 8,
	color = "#10b981",
	animation = true,
}: CircularProgressProps) => {
	const targetPercent = max > 0 ? (value / max) * 100 : 0;
	const [currentPercent, setCurrentPercent] = useState(animation ? 0 : targetPercent);

	useEffect(() => {
		if (animation) {
			const timer = setTimeout(() => {
				setCurrentPercent(Math.min(100, Math.max(0, targetPercent)));
			}, 100);
			return () => clearTimeout(timer);
		}

		setCurrentPercent(targetPercent);
		return () => {};
	}, [targetPercent, animation]);

	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const offset = circumference - (currentPercent / 100) * circumference;

	const labelSize = size * 0.12;
	const valueSize = size * 0.22;
	const unitSize = size * 0.1;
	const labelMargin = size * 0.08;

	return (
		<div className="flex flex-col items-center">
			{label && (
				<span
					className="font-bold uppercase text-subtle"
					style={{
						fontSize: `${labelSize}px`,
						marginBottom: `${labelMargin}px`,
					}}
				>
					{label}
				</span>
			)}

			<div
				className="relative flex items-center justify-center"
				style={{ width: size, height: size }}
			>
				<svg width={size} height={size} className="-rotate-90 transform">
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke="#e7e5e4"
						strokeWidth={strokeWidth}
						fill="transparent"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={color}
						strokeWidth={strokeWidth}
						fill="transparent"
						strokeDasharray={circumference}
						style={{
							strokeDashoffset: offset,
							transition: animation
								? "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
								: "none",
							strokeLinecap: "round",
						}}
					/>
				</svg>

				<div className="absolute flex items-baseline justify-center text-ink">
					<span
						className="font-extrabold leading-none"
						style={{ fontSize: `${valueSize}px` }}
					>
						{Math.round(value).toLocaleString()}
					</span>
					{unit && (
						<span
							className="ml-0.5 font-bold text-muted"
							style={{ fontSize: `${unitSize}px` }}
						>
							{unit}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};
