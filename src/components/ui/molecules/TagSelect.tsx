"use client"

import { useState } from "react";
import { HorizontalStackContainer, VerticalStackContainer } from "./Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { BaseInputText } from "../atoms/Input";

// 仮のデータ
const ALL_GROUPS = [
    { id: "3b", label: "3年B組" },
    { id: "2a", label: "2年A組" },
    { id: "2b", label: "2年B組" },
];

type Tag = {
    id: string;
    label: string;
}

export const TagSelect = () => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([
        { id: "3", label: "3年" },
        { id: "3a", label: "3年A組" },
    ]);
    const [isOpen, setIsOpen] = useState(false);

    const removeTag = (tagToRemove: Tag) => {
        setSelectedTags(selectedTags.filter(tag => tag.id !== tagToRemove.id));
    };

    const addTag = (tagToAdd: Tag) => {
        if (!selectedTags.find(tag => tag.id === tagToAdd.id)) {
            setSelectedTags([...selectedTags, tagToAdd]);
        }
        setIsOpen(false);
    };

    const availableGroups = ALL_GROUPS.filter(
        group => !selectedTags.find(tag => tag.id === group.id)
    );

    return (
        <VerticalStackContainer space={2}>
            <label className="font-semibold text-sm text-slate-800">グループ選択</label>
            <p className="text-xs text-zinc-500">複数選択可能です</p>
            <div className="bg-white border border-gray-300 rounded-lg p-4">
                <HorizontalStackContainer space={2} className="flex-wrap">
                    {selectedTags.map(tag => (
                        <div key={tag.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${tag.label.includes('組') ? 'bg-green-100 border-green-500' : 'bg-slate-200 border-slate-400'}`}>
                            <span className={`text-xs font-medium ${tag.label.includes('組') ? 'text-green-800' : 'text-slate-800'}`}>{tag.label}</span>
                            <button onClick={() => removeTag(tag)}>
                                <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5 text-slate-600" />
                            </button>
                        </div>
                    ))}
                </HorizontalStackContainer>
                <div className="relative mt-3">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="bg-zinc-50 border border-zinc-200 rounded-lg w-full h-12 px-4 flex justify-between items-center"
                    >
                        <span className="text-zinc-500">他のグループを追加</span>
                        <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 text-zinc-500" />
                    </button>
                    {isOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                            <ul>
                                {availableGroups.map(group => (
                                    <li
                                        key={group.id}
                                        onClick={() => addTag(group)}
                                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                                    >
                                        {group.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </VerticalStackContainer>
    );
};
