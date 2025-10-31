"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Users,
  Search,
  Filter,
  Plus,
  Download,
} from "lucide-react";
import { SideBar } from "@/components/ui/templates/SideBar"
import { BaseButton } from "@/components/ui/atoms/Button";
import { BaseInputText } from "@/components/ui/atoms/Input";
import { Tag, DreamerListItem } from "@/components/ui/atoms/Text";
import { Card } from "@/components/ui/molecules/Card";
import { SimpleModal } from "@/components/ui/molecules/Modal";
import { AddDreamerModal } from "@/components/ui/molecules/AddDreamerModal";

const dummyDreamers = [
  {
    name: "山田太郎",
    studentId: "ST001",
    groups: ["3年", "3-1"],
    lastLogin: "2024/01/15 14:30",
    createdAt: "2023/04/01",
  },
  {
    name: "鈴木花子",
    studentId: "ST002",
    groups: ["3年", "3-1"],
    lastLogin: "2024/01/14 10:00",
    createdAt: "2023/04/01",
  },
  {
    name: "佐藤一郎",
    studentId: "ST003",
    groups: ["3年", "3-1"],
    lastLogin: "2024/01/15 09:30",
    createdAt: "2023/04/01",
  },
  {
    name: "田中次郎",
    studentId: "ST004",
    groups: ["3年", "3-1"],
    lastLogin: "2024/01/13 18:00",
    createdAt: "2023/04/01",
  },
];

export default function DreamerGroupDetailPage({
  params,
}: {
  params: { group_id: string };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SideBar>
      <div className="bg-slate-100 p-8 flex-1">
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/mentor/dreamer/group">
            <span className="text-gray-500 hover:underline">
              グループ管理
            </span>
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-blue-500 font-semibold">
            3年A組
          </span>
        </div>

        <div className="mb-8">
          <Card className="p-0">
            <div className="p-8 flex items-center space-x-6">
              <div className="bg-blue-100 p-4 rounded-lg">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  3年A組
                </h2>
              </div>
              <BaseButton color="white" className="border border-zinc-200">編集</BaseButton>
            </div>
            <div className="p-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Dreamer数
                </p>
                <p className="font-semibold">
                  6
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  説明
                </p>
                <p className="font-semibold">
                  ３年A組（進学コース）
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  アカウント作成日
                </p>
                <p className="font-semibold">
                  2023年4月1日
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  平均利用時間（1日）
                </p>
                <p className="font-semibold">
                  1時間
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  総使用時間
                </p>
                <p className="font-semibold">
                  48時間30分
                </p>
              </div>
            </div>
          </Card>
        </div>

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
          <BaseButton color="blue" onClick={() => setIsModalOpen(true)}>
              <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Dreamer追加
              </div>
          </BaseButton>
        </div>

        <Card className="p-0">
          <div className="p-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold">
              Dreamer一覧
            </h3>
            <BaseButton color="white" className="border-none">
              <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  CSV一括
              </div>
            </BaseButton>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">名前</th>
                  <th className="p-4 text-left font-semibold text-gray-600">学籍番号</th>
                  <th className="p-4 text-left font-semibold text-gray-600">グループ</th>
                  <th className="p-4 text-left font-semibold text-gray-600">最終ログイン</th>
                  <th className="p-4 text-left font-semibold text-gray-600">作成日</th>
                </tr>
              </thead>
              <tbody>
                {dummyDreamers.map((dreamer, index) => (
                  <DreamerListItem
                    key={index}
                    name={dreamer.name}
                    student_num={dreamer.studentId}
                    group={dreamer.groups.map((g, i) => ({ label: g, id: `${index}-${i}` }))}
                    login_at={dreamer.lastLogin}
                    created_at={dreamer.createdAt}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <SimpleModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          title="3年A組にDreamerを追加"
          className="w-full max-w-4xl"
        >
          <AddDreamerModal />
        </SimpleModal>
      </div>
    </SideBar>
  );
}
