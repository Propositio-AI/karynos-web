"use client"

import { useState } from "react";

type ModeToggleProps = {
    onToggle: (mode: 'single' | 'bulk') => void;
}

export const ModeToggle = ({ onToggle }: ModeToggleProps) => {
    const [selected, setSelected] = useState<'single' | 'bulk'>('single');

    const handleToggle = (mode: 'single' | 'bulk') => {
        setSelected(mode);
        onToggle(mode);
    }

    return (
        <div className="flex border border-zinc-200 rounded-lg">
            <button
                onClick={() => handleToggle('single')}
                className={`px-5 py-2 text-sm font-medium rounded-l-md cursor-pointer ${selected === 'single' ? 'bg-blue-500 text-white' : 'bg-zinc-50 text-zinc-500'}`}
            >
                単一
            </button>
            <button
                onClick={() => handleToggle('bulk')}
                className={`px-5 py-2 text-sm font-medium rounded-r-md cursor-pointer ${selected === 'bulk' ? 'bg-blue-500 text-white' : 'bg-zinc-50 text-zinc-500'}`}
            >
                一括
            </button>
        </div>
    )
}