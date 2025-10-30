"use client";
import { BaseInputText } from "@/components/ui/atoms/Input";
import { BaseButton } from "@/components/ui/atoms/Button";
import { SimpleModal } from "@/components/ui/molecules/Modal";
import {
  faFilter,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Dreamer = {
  id: string;
  name: string;
  studentId: string;
  groups: string[];
};

const mockDreamers: Dreamer[] = [
  { id: "1", name: "山田太郎", studentId: "ST001", groups: ["3年", "3-1"] },
  { id: "2", name: "山田太郎", studentId: "ST001", groups: ["3年", "3-1"] },
  { id: "3", name: "山田太郎", studentId: "ST001", groups: ["3年", "3-1"] },
  { id: "4", name: "山田太郎", studentId: "ST001", groups: ["3年", "3-1"] },
  { id: "5", name: "山田太郎", studentId: "ST001", groups: ["3年", "3-1"] },
  { id: "6", name: "山田太郎", studentId: "ST001", groups: ["3年", "3-1"] },
];

type AddDreamerToGroupModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupName: string;
};

export const AddDreamerToGroupModal = ({
  isOpen,
  setIsOpen,
  groupName,
}: AddDreamerToGroupModalProps) => {
  return (
    <SimpleModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={`${groupName}にDreamerを追加`}
      className="w-full max-w-4xl"
    >
      <div className="bg-white rounded-lg p-8 pt-4 space-y-8">
        <div className="flex items-center gap-4">
          <div className="grow">
            <BaseInputText
              placeholder="Dreamer名で検索"
              className="w-full"
              value=""
              onChange={() => {}}
            />
          </div>
          <BaseButton
            color="white"
            className="rounded-full px-4! border border-zinc-200"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            フィルタ
          </BaseButton>
          <BaseButton color="blue" className="rounded-full px-4!">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Dreamer追加
          </BaseButton>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-zinc-100 px-6 py-3">
            <p className="font-bold">Dreamer一覧</p>
          </div>
          <table className="w-full text-left">
            <thead className="bg-zinc-200">
              <tr>
                <th className="p-3 w-12">
                  <input
                    type="checkbox"
                    id="select-all"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="p-3">名前</th>
                <th className="p-3">学籍番号</th>
                <th className="p-3">グループ</th>
              </tr>
            </thead>
            <tbody>
              {mockDreamers.map((dreamer) => (
                <tr key={dreamer.id} className="border-b last:border-b-0">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      id={`dreamer-${dreamer.id}`}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                      <p>{dreamer.name}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <p>{dreamer.studentId}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {dreamer.groups.map((group) => (
                        <div
                          key={group}
                          className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {group}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4 pt-8">
          <BaseButton
            color="white"
            onClick={() => setIsOpen(false)}
            className="w-32 border border-zinc-200"
          >
            キャンセル
          </BaseButton>
          <BaseButton
            color="blue"
            onClick={() => setIsOpen(false)}
            className="w-32"
          >
            追加
          </BaseButton>
        </div>
      </div>
    </SimpleModal>
  );
};
