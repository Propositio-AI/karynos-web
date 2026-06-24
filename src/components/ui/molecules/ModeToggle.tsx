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
        <div className="flex border border-line rounded-(--radius-sm)">
            <button
                onClick={() => handleToggle('single')}
                className={`px-5 py-2 text-sm font-medium rounded-l-(--radius-sm) cursor-pointer ${selected === 'single' ? 'bg-blue-500 text-white' : 'bg-canvas text-muted'}`}
            >
                単一
            </button>
            <button
                onClick={() => handleToggle('bulk')}
                className={`px-5 py-2 text-sm font-medium rounded-r-(--radius-sm) cursor-pointer ${selected === 'bulk' ? 'bg-blue-500 text-white' : 'bg-canvas text-muted'}`}
            >
                一括
            </button>
        </div>
    )
}