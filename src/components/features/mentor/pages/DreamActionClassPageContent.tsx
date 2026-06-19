"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBolt,
    faCheck,
    faPaperPlane,
    faRotateRight,
    faSpinner,
    faExclamationTriangle,
    faFolderOpen,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BreadCrumb } from "@/components/ui/atoms/Text";
import { DreamActionMaterial, DreamActionStatus } from "@/types/feature/dream-action/dreamAction";
import { MaterialFolder } from "@/types/feature/mentor/material";
import {
    getDreamActions,
    generateDreamAction,
    completeDreamActionBatch,
    distributeDreamAction,
    retryDreamAction,
} from "@/lib/api/gen/dreamAction/dreamAction";
import { getMaterialFolders } from "@/lib/api/gen/mentor/materials";
import { getClassById } from "@/lib/api/gen/mentor/classes";

type Props = { classId: string };

const statusConfig: Record<DreamActionStatus, { label: string; badge: string }> = {
    pending: { label: "未生成", badge: "bg-zinc-100 text-zinc-600" },
    generating: { label: "生成中", badge: "bg-yellow-100 text-yellow-700" },
    completed: { label: "確認待ち", badge: "bg-blue-100 text-blue-700" },
    failed: { label: "失敗", badge: "bg-red-100 text-red-700" },
    distributed: { label: "配布済み", badge: "bg-emerald-100 text-emerald-700" },
};

const MaterialRow = ({
    material,
    onDistribute,
    onRetry,
    distributing,
}: {
    material: DreamActionMaterial;
    onDistribute: (id: string) => void;
    onRetry: (id: string) => void;
    distributing: boolean;
}) => {
    const [expanded, setExpanded] = useState(false);
    const { label, badge } = statusConfig[material.status];

    return (
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
            <div className="flex items-center gap-3 p-4">
                <div className="flex-1">
                    <HorizontalStackContainer space={2} className="flex-wrap">
                        <p className="font-semibold text-slate-800">{material.dreamerName}</p>
                        <span className="text-xs text-zinc-400">({material.dreamerJob})</span>
                    </HorizontalStackContainer>
                    <p className="text-xs text-zinc-500 mt-0.5">{material.subject} · {material.unit}</p>
                </div>

                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge} ${material.status === "generating" ? "animate-pulse" : ""}`}>
                    {material.status === "generating" ? (
                        <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin w-3 h-3" />
                            生成中...
                        </span>
                    ) : label}
                </span>

                <div className="flex items-center gap-2">
                    {material.status === "completed" && (
                        <>
                            <button
                                className="flex items-center gap-1 text-xs px-3 py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-slate-700"
                                onClick={() => setExpanded((v) => !v)}
                            >
                                内容確認
                                <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
                            </button>
                            <button
                                disabled={distributing}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => onDistribute(material.id)}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3" />
                                配布
                            </button>
                        </>
                    )}
                    {material.status === "failed" && (
                        <button
                            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200"
                            onClick={() => onRetry(material.id)}
                        >
                            <FontAwesomeIcon icon={faRotateRight} className="w-3 h-3" />
                            再試行
                        </button>
                    )}
                    {material.status === "distributed" && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600">
                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                            配布済み
                        </span>
                    )}
                </div>
            </div>

            {expanded && material.generatedContent && (
                <div className="border-t border-zinc-100 px-4 py-3 bg-zinc-50">
                    <p className="text-xs font-semibold text-zinc-500 mb-2">AI生成コンテンツ（プレビュー）</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{material.generatedContent}</p>
                    {material.relevanceExplanation && (
                        <p className="text-xs text-blue-600 mt-2 font-medium">{material.relevanceExplanation}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default function DreamActionClassPageContent({ classId }: Props) {
    const [className, setClassName] = useState("");
    const [folders, setFolders] = useState<MaterialFolder[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState("");
    const [materials, setMaterials] = useState<DreamActionMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [distributingId, setDistributingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        Promise.all([
            getClassById(classId),
            getMaterialFolders(classId),
            getDreamActions(classId),
        ])
            .then(([cls, flds, actions]) => {
                setClassName(cls.name);
                setFolders(flds);
                if (flds.length > 0) setSelectedFolderId(flds[0]?.id ?? "");
                setMaterials(actions);
            })
            .finally(() => setLoading(false));
    }, [classId]);

    const handleGenerate = async () => {
        if (!selectedFolderId) return;
        setGenerating(true);
        try {
            await generateDreamAction(classId, selectedFolderId);
            setMaterials((prev) =>
                prev.map((m) => ({ ...m, status: "generating" as DreamActionStatus }))
            );
            showToast("補助教材の生成を開始しました", "success");

            setTimeout(async () => {
                const updated = await completeDreamActionBatch(classId);
                setMaterials(updated);
                showToast("補助教材の生成が完了しました", "success");
                setGenerating(false);
            }, 3000);
        } catch {
            showToast("生成の開始に失敗しました", "error");
            setGenerating(false);
        }
    };

    const handleDistribute = async (materialId: string) => {
        setDistributingId(materialId);
        try {
            const updated = await distributeDreamAction(classId, materialId);
            setMaterials((prev) => prev.map((m) => (m.id === materialId ? updated : m)));
            showToast("生徒へ配布しました", "success");
        } catch {
            showToast("配布に失敗しました", "error");
        } finally {
            setDistributingId(null);
        }
    };

    const handleRetry = async (materialId: string) => {
        try {
            const updated = await retryDreamAction(classId, materialId);
            setMaterials((prev) => prev.map((m) => (m.id === materialId ? updated : m)));
            showToast("再試行を開始しました", "success");

            setTimeout(async () => {
                const all = await completeDreamActionBatch(classId);
                setMaterials(all);
            }, 3000);
        } catch {
            showToast("再試行に失敗しました", "error");
        }
    };

    const distributedCount = materials.filter((m) => m.status === "distributed").length;
    const completedCount = materials.filter((m) => m.status === "completed").length;

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                <BreadCrumb
                    links={[
                        { name: "Dream Action", link: "/mentor/dream-action" },
                        { name: className || classId, link: "" },
                    ]}
                />

                <h1>Dream Action — {className}</h1>
                <p className="text-sm text-zinc-500 -mt-4">
                    授業資料をもとに、各生徒の「仮の夢」と授業内容を接続する補助教材を生成・配布します。
                    <span className="font-medium text-blue-600 ml-1">この教材は補助教材であり、先生の授業を置き換えるものではありません。</span>
                </p>

                {loading ? (
                    <div className="space-y-4">
                        <div className="bg-white border border-zinc-200 rounded-lg p-6 animate-pulse h-32" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-zinc-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="font-bold text-blue-900 mb-4">
                                <FontAwesomeIcon icon={faBolt} className="mr-2" />
                                補助教材を生成する
                            </h3>
                            <div className="flex items-end gap-4 flex-wrap">
                                <div className="flex-1 min-w-48">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        <FontAwesomeIcon icon={faFolderOpen} className="mr-1.5 text-zinc-500" />
                                        授業資料フォルダを選択
                                    </label>
                                    <select
                                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                                        value={selectedFolderId}
                                        onChange={(e) => setSelectedFolderId(e.target.value)}
                                    >
                                        {folders.length === 0 ? (
                                            <option disabled>授業資料フォルダがありません</option>
                                        ) : (
                                            folders.map((f) => (
                                                <option key={f.id} value={f.id}>
                                                    {f.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <button
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    onClick={handleGenerate}
                                    disabled={generating || folders.length === 0 || !selectedFolderId}
                                >
                                    {generating ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4" />
                                            生成中...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faBolt} className="w-4 h-4" />
                                            生成開始
                                        </>
                                    )}
                                </button>
                            </div>
                            {folders.length === 0 && (
                                <p className="text-xs text-amber-700 mt-2">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                                    授業資料フォルダがありません。先に授業資料をアップロードしてください。
                                </p>
                            )}
                        </div>

                        <HorizontalStackContainer className="gap-4 flex-wrap">
                            <div className="text-sm text-zinc-600">
                                <span className="font-semibold text-emerald-600">{distributedCount}</span>名 配布済み
                            </div>
                            <div className="text-sm text-zinc-600">
                                <span className="font-semibold text-blue-600">{completedCount}</span>名 確認待ち
                            </div>
                            <div className="text-sm text-zinc-600">
                                計 <span className="font-semibold">{materials.length}</span>件
                            </div>
                        </HorizontalStackContainer>

                        {materials.length === 0 ? (
                            <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
                                <FontAwesomeIcon icon={faBolt} className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                                <p className="text-zinc-500 font-medium">補助教材がまだ生成されていません</p>
                                <p className="text-sm text-zinc-400 mt-1">上のフォームから生成を開始してください</p>
                            </div>
                        ) : (
                            <VerticalStackContainer space={2}>
                                {materials.map((material) => (
                                    <MaterialRow
                                        key={material.id}
                                        material={material}
                                        onDistribute={handleDistribute}
                                        onRetry={handleRetry}
                                        distributing={distributingId === material.id}
                                    />
                                ))}
                            </VerticalStackContainer>
                        )}
                    </>
                )}
            </VerticalStackContainer>

            {toast && (
                <div
                    className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all ${
                        toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                >
                    {toast.message}
                </div>
            )}
        </SideBar>
    );
}
