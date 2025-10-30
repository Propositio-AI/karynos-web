"use client";
import { useState } from "react";
import {
  faFilter,
  faPlus,
  faChevronRight,
  faFileCsv,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton } from "@/components/ui/atoms/Button";
import { BaseInputText } from "@/components/ui/atoms/Input";
import {
  VerticalStackContainer,
  HorizontalStackContainer,
  GridContainer,
} from "@/components/ui/molecules/Container";
import { AddDreamerToGroupModal } from "@/components/ui/molecules/AddDreamerToGroupModal";
import { Tag } from "@/components/ui/atoms/Text";
import Link from "next/link";

type Dreamer = {
  id: string;
  name: string;
  studentId: string;
  groups: { label: string; id: string }[];
  lastLogin: string;
  createdAt: string;
};

const mockDreamers: Dreamer[] = [
  {
    id: "1",
    name: "山田太郎",
    studentId: "ST001",
    groups: [
      { id: "g1", label: "3年" },
      { id: "g2", label: "3-1" },
    ],
    lastLogin: "2024/01/15 14:30",
    createdAt: "2023/04/01",
  },
  {
    id: "2",
    name: "山田太郎",
    studentId: "ST001",
    groups: [
      { id: "g1", label: "3年" },
      { id: "g2", label: "3-1" },
    ],
    lastLogin: "2024/01/15 14:30",
    createdAt: "2023/04/01",
  },
  {
    id: "3",
    name: "山田太郎",
    studentId: "ST001",
    groups: [
      { id: "g1", label: "3年" },
      { id: "g2", label: "3-1" },
    ],
    lastLogin: "2024/01/15 14:30",
    createdAt: "2023/04/01",
  },
  {
    id: "4",
    name: "山田太郎",
    studentId: "ST001",
    groups: [
      { id: "g1", label: "3年" },
      { id: "g2", label: "3-1" },
    ],
    lastLogin: "2024/01/15 14:30",
    createdAt: "2023/04/01",
  },
];

const DreamerGroupDetailPage = ({
  params,
}: {
  params: { group_id: string };
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const groupName = "3年A組"; // TODO: 動的に取得

  return (
    <>
      <VerticalStackContainer space={8} className="p-8 bg-slate-50 h-full">
        {/* Breadcrumb */}
        <HorizontalStackContainer space={2} className="items-center">
          <Link href="/mentor/dreamer/group">
            <p className="text-sm text-zinc-500 hover:underline">
              グループ管理
            </p>
          </Link>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="w-3 h-3 text-zinc-500"
          />
          <p className="text-sm font-semibold text-blue-500">{groupName}</p>
        </HorizontalStackContainer>

        {/* Page Content */}
        <GridContainer className="gap-8" minWidth={400}>
          {/* Left Panel */}
          <VerticalStackContainer>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
              <HorizontalStackContainer
                space={6}
                className="p-8 items-center"
              >
                <div className="flex-grow">
                  <p className="text-2xl font-bold text-slate-900">
                    {groupName}
                  </p>
                </div>
                <BaseButton color="white" className="border border-zinc-200">
                  編集
                </BaseButton>
              </HorizontalStackContainer>
              <div className="p-8 border-t border-slate-200">
                <GridContainer className="gap-y-6 gap-x-8" minWidth={200}>
                  <VerticalStackContainer space={1}>
                    <p className="text-sm text-zinc-500">Dreamer数</p>
                    <p className="font-semibold text-slate-900">6</p>
                  </VerticalStackContainer>
                  <VerticalStackContainer space={1}>
                    <p className="text-sm text-zinc-500">説明</p>
                    <p className="font-semibold text-slate-900">
                      ３年A組（進学コース）
                    </p>
                  </VerticalStackContainer>
                  <VerticalStackContainer space={1}>
                    <p className="text-sm text-zinc-500">アカウント作成日</p>
                    <p className="font-semibold text-slate-900">
                      2023年4月1日
                    </p>
                  </VerticalStackContainer>
                  <VerticalStackContainer space={1}>
                    <p className="text-sm text-zinc-500">
                      平均利用時間（1日）
                    </p>
                    <p className="font-semibold text-slate-900">1時間</p>
                  </VerticalStackContainer>
                  <VerticalStackContainer space={1}>
                    <p className="text-sm text-zinc-500">総使用時間</p>
                    <p className="font-semibold text-slate-900">48時間30分</p>
                  </VerticalStackContainer>
                </GridContainer>
              </div>
            </div>
          </VerticalStackContainer>
        </GridContainer>

        {/* Actions */}
        <HorizontalStackContainer space={4} className="items-center">
          <div className="grow">
            <BaseInputText
              placeholder="Dreamer名で検索"
              className="w-full"
              value=""
              onChange={() => {}}
            />
          </div>
          <BaseButton color="white" className="border border-zinc-200">
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            フィルタ
          </BaseButton>
          <BaseButton color="blue" onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Member 追加
          </BaseButton>
        </HorizontalStackContainer>

        {/* Table Section */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <HorizontalStackContainer
            space={4}
            className="bg-zinc-100 px-6 py-3 items-center"
          >
            <p className="font-semibold text-slate-900 grow">Dreamer一覧</p>
            <HorizontalStackContainer space={2} className="items-center">
              <p className="text-sm text-zinc-500">一括操作:</p>
              <BaseButton color="white" className="text-sm">
                <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
                CSV一括
              </BaseButton>
            </HorizontalStackContainer>
          </HorizontalStackContainer>
          <table className="w-full text-left">
            <thead className="bg-zinc-200 text-sm text-slate-900 font-semibold">
              <tr>
                <th className="p-3">名前</th>
                <th className="p-3">学籍番号</th>
                <th className="p-3">グループ</th>
                <th className="p-3">最終ログイン</th>
                <th className="p-3">作成日</th>
              </tr>
            </thead>
            <tbody>
              {mockDreamers.map((dreamer) => (
                <tr
                  key={dreamer.id}
                  className="border-b last:border-b-0 hover:bg-zinc-50 cursor-pointer"
                >
                  <td className="p-3">
                    <HorizontalStackContainer space={3} className="items-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-gray-400"
                      />
                      <p>{dreamer.name}</p>
                    </HorizontalStackContainer>
                  </td>
                  <td className="p-3">{dreamer.studentId}</td>
                  <td className="p-3">
                    <HorizontalStackContainer space={2}>
                      {dreamer.groups.map((g) => (
                        <Tag key={g.id} color="slate" text={g.label} />
                      ))}
                    </HorizontalStackContainer>
                  </td>
                  <td className="p-3">{dreamer.lastLogin}</td>
                  <td className="p-3">{dreamer.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </VerticalStackContainer>
      <AddDreamerToGroupModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        groupName={groupName}
      />
    </>
  );
};

export default DreamerGroupDetailPage;