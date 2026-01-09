"use client";

import React, { useEffect, useState } from "react";

interface CircularProgressProps {
    //値
    value: number;
    //最大値
    max?: number;
    //単位
    unit?: string;
    //ラベル名
    label?: string;
    //サイズ（px）
    size?: number;
    //線の太さ(px)
    strokeWidth?: number;
    //色
    color?: string;
    //アニメーション有無
    animation?: boolean;
}

export const CircularProgress = ({
    value = 60,
    max = 100,
    unit = "%",
    label = "デフォルトラベル",
    size = 100,
    strokeWidth = 8,
    color = "#6366f1",
    animation = true,
}: CircularProgressProps) => {
    const targetPercent = max > 0 ? (value / max) * 100 : 0;
    const [currentPercent, setCurrentPercent] = useState(
        animation ? 0 : targetPercent
    );

    useEffect(() => {
        if (animation) {
            const timer = setTimeout(() => {
                setCurrentPercent(Math.min(100, Math.max(0, targetPercent)));
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setCurrentPercent(targetPercent);
            return () => {};
        }
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
            {/* 1. ラベル部分 */}
            {label && (
                <span
                    className="font-bold text-zinc-400 tracking-widest uppercase"
                    style={{
                        fontSize: `${labelSize}px`,
                        marginBottom: `${labelMargin}px`,
                    }}
                >
                    {label}
                </span>
            )}

            {/* 2. グラフ本体 */}
            <div
                className="relative flex items-center justify-center"
                style={{ width: size, height: size }}
            >
                <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#e5e7eb"
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

                {/* 3. 中央テキスト */}
                <div className="absolute flex items-baseline justify-center text-zinc-800">
                    <span
                        className="font-extrabold leading-none"
                        style={{ fontSize: `${valueSize}px` }}
                    >
                        {Math.round(value).toLocaleString()}
                    </span>
                    {unit && (
                        <span
                            className="font-bold text-zinc-500 ml-0.5"
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
