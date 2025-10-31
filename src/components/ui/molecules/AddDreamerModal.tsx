"use client";

import { BaseButton } from "@/components/ui/atoms/Button";
import { BaseInputText } from "@/components/ui/atoms/Input";
import {Tag } from "@/components/ui/atoms/Text";
import { Filter, Plus, Search } from "lucide-react";

const dummyDreamers = [
  {
    name: "山田太郎",
    studentId: "ST001",
    groups: ["3年", "3-1"],
    checked: false,
  },
  {
    name: "鈴木花子",
    studentId: "ST002",
    groups: ["3年", "3-1"],
    checked: true,
  },
  {
    name: "佐藤一郎",
    studentId: "ST003",
    groups: ["3年", "3-1"],
    checked: false,
  },
];

export const AddDreamerModal = () => {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <BaseInputText placeholder="Dreamer名で検索" className="pl-10 w-full" />
        </div>
        <BaseButton color="white" className="border border-zinc-200">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            フィルタ
          </div>
        </BaseButton>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 w-12"></th>
              <th className="p-4 text-left font-semibold text-gray-600">名前</th>
              <th className="p-4 text-left font-semibold text-gray-600">学籍番号</th>
              <th className="p-4 text-left font-semibold text-gray-600">グループ</th>
            </tr>
          </thead>
          <tbody>
            {dummyDreamers.map((dreamer, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">
                  <input type="checkbox" defaultChecked={dreamer.checked} className="h-5 w-5"/>
                </td>
                <td className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <p className="">{dreamer.name}</p>
                </td>
                <td className="p-4 text-gray-600">{dreamer.studentId}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    {dreamer.groups.map((group, i) => (
                      <Tag key={i} color={ i === 0 ? "slate" : "green"} text={group} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center space-x-4 mt-8">
        <BaseButton color="white" className="border border-zinc-200">キャンセル</BaseButton>
        <BaseButton color="blue">追加</BaseButton>
      </div>
    </div>
  );
};
