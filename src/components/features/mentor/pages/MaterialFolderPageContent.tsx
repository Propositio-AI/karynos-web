"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFolderOpen,
    faFolder,
    faPlus,
    faTrash,
    faUpload,
    faFile,
    faFilePdf,
    faFileWord,
    faFileImage,
    faFileLines,
    faChevronDown,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BreadCrumb } from "@/components/ui/atoms/Text";
import { MaterialFolder, MaterialFile, UploadState } from "@/types/feature/mentor/material";
import {
    getMaterialFolders,
    getMaterialFiles,
    createMaterialFolder,
    deleteMaterialFolder,
    uploadMaterialFile,
    deleteMaterialFile,
} from "@/lib/api/gen/mentor/materials";
import { getClassById } from "@/lib/api/gen/mentor/classes";

type Props = { classId: string };

const fileTypeIcon = (type: MaterialFile["fileType"]) => {
    switch (type) {
        case "pdf": return faFilePdf;
        case "docx": return faFileWord;
        case "image": return faFileImage;
        case "txt": return faFileLines;
        default: return faFile;
    }
};

const fileTypeColor = (type: MaterialFile["fileType"]) => {
    switch (type) {
        case "pdf": return "text-red-500";
        case "pptx": return "text-orange-500";
        case "docx": return "text-blue-500";
        case "image": return "text-purple-500";
        default: return "text-zinc-500";
    }
};

const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
};

type FolderRowProps = {
    folder: MaterialFolder;
    onDelete: (id: string) => void;
    onUpload: (folderId: string, file: File) => void;
    uploadProgress: number | null;
    uploadState: UploadState;
};

const FolderRow = ({ folder, onDelete, onUpload, uploadProgress, uploadState }: FolderRowProps) => {
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState<MaterialFile[]>([]);
    const [filesLoading, setFilesLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const loadFiles = () => {
        if (!open) {
            setFilesLoading(true);
            getMaterialFiles(folder.id)
                .then(setFiles)
                .finally(() => setFilesLoading(false));
        }
        setOpen((v) => !v);
    };

    const handleDeleteFile = async (fileId: string) => {
        await deleteMaterialFile(fileId);
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        setConfirmDelete(null);
    };

    return (
        <div className="border border-zinc-200 rounded-lg bg-white overflow-hidden">
            <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-50 transition-colors"
                onClick={loadFiles}
            >
                <FontAwesomeIcon
                    icon={open ? faChevronDown : faChevronRight}
                    className="w-3 h-3 text-zinc-400"
                />
                <FontAwesomeIcon
                    icon={open ? faFolderOpen : faFolder}
                    className="w-5 h-5 text-yellow-500"
                />
                <div className="flex-1">
                    <p className="font-semibold text-slate-800">{folder.name}</p>
                    <p className="text-xs text-zinc-400">{folder.subject} · {folder.fileCount}ファイル</p>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="file"
                        ref={fileRef}
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) onUpload(folder.id, f);
                            e.target.value = "";
                        }}
                    />
                    <button
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        onClick={() => fileRef.current?.click()}
                    >
                        <FontAwesomeIcon icon={faUpload} className="w-3 h-3" />
                        アップロード
                    </button>
                    <button
                        className="flex items-center gap-1 text-xs px-2 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => setConfirmDelete(folder.id)}
                    >
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* アップロード進捗 */}
            {uploadState === "uploading" && uploadProgress !== null && (
                <div className="px-4 pb-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                        <span>アップロード中...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-1.5">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}
            {uploadState === "success" && (
                <div className="px-4 pb-3 text-xs text-emerald-600 font-medium">
                    アップロードが完了しました
                </div>
            )}
            {uploadState === "error" && (
                <div className="px-4 pb-3 text-xs text-red-600 font-medium">
                    アップロードに失敗しました
                </div>
            )}

            {/* ファイル一覧 */}
            {open && (
                <div className="border-t border-zinc-100">
                    {filesLoading ? (
                        <div className="p-4 space-y-2">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-8 bg-zinc-100 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : files.length === 0 ? (
                        <div className="p-6 text-center text-zinc-400 text-sm">
                            ファイルがまだアップロードされていません
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100">
                            {files.map((file) => (
                                <div key={file.id} className="flex items-center gap-3 px-8 py-3 hover:bg-zinc-50">
                                    <FontAwesomeIcon
                                        icon={fileTypeIcon(file.fileType)}
                                        className={`w-4 h-4 shrink-0 ${fileTypeColor(file.fileType)}`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700 truncate">{file.name}</p>
                                        <p className="text-xs text-zinc-400">
                                            {formatSize(file.size)} · {file.uploadedAt}
                                        </p>
                                    </div>
                                    {file.usedInDreamActions && file.usedInDreamActions.length > 0 && (
                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                            Dream Action使用中
                                        </span>
                                    )}
                                    <button
                                        className="text-zinc-400 hover:text-red-500 transition-colors"
                                        onClick={() => setConfirmDelete(file.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 削除確認ダイアログ */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(null)} />
                    <div className="relative bg-white rounded-xl p-6 shadow-xl w-80">
                        <h3 className="text-base font-bold mb-2">削除の確認</h3>
                        <p className="text-sm text-zinc-600 mb-6">
                            {confirmDelete === folder.id
                                ? `フォルダ「${folder.name}」を削除しますか？中のファイルもすべて削除されます。`
                                : "このファイルを削除しますか？この操作は取り消せません。"}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                className="px-4 py-2 text-sm rounded-lg border border-zinc-200 hover:bg-zinc-50"
                                onClick={() => setConfirmDelete(null)}
                            >
                                キャンセル
                            </button>
                            <button
                                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                                onClick={() => {
                                    if (confirmDelete === folder.id) {
                                        onDelete(folder.id);
                                    } else {
                                        handleDeleteFile(confirmDelete);
                                    }
                                }}
                            >
                                削除する
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

type UploadingFolder = {
    folderId: string;
    progress: number;
    state: UploadState;
};

export default function MaterialFolderPageContent({ classId }: Props) {
    const [folders, setFolders] = useState<MaterialFolder[]>([]);
    const [className, setClassName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showNewFolder, setShowNewFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [newFolderSubject, setNewFolderSubject] = useState("");
    const [creating, setCreating] = useState(false);
    const [uploadingFolders, setUploadingFolders] = useState<Record<string, UploadingFolder>>({});

    const load = () => {
        setLoading(true);
        setError(null);
        Promise.all([getClassById(classId), getMaterialFolders(classId)])
            .then(([cls, flds]) => {
                setClassName(cls.name);
                setFolders(flds);
            })
            .catch(() => setError("授業資料の読み込みに失敗しました。"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [classId]);

    const handleCreateFolder = async () => {
        if (!newFolderName.trim() || !newFolderSubject.trim()) return;
        setCreating(true);
        try {
            const f = await createMaterialFolder({
                name: newFolderName.trim(),
                subject: newFolderSubject.trim(),
                classId,
            });
            setFolders((prev) => [...prev, f]);
            setNewFolderName("");
            setNewFolderSubject("");
            setShowNewFolder(false);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteFolder = async (id: string) => {
        await deleteMaterialFolder(id);
        setFolders((prev) => prev.filter((f) => f.id !== id));
    };

    const handleUpload = async (folderId: string, file: File) => {
        setUploadingFolders((prev) => ({
            ...prev,
            [folderId]: { folderId, progress: 0, state: "uploading" },
        }));
        try {
            await uploadMaterialFile(classId, file, (pct) => {
                setUploadingFolders((prev) => ({
                    ...prev,
                    [folderId]: { folderId, progress: pct, state: "uploading" },
                }));
            });
            setUploadingFolders((prev) => ({
                ...prev,
                [folderId]: { folderId, progress: 100, state: "success" },
            }));
            setTimeout(() => {
                setUploadingFolders((prev) => {
                    const next = { ...prev };
                    delete next[folderId];
                    return next;
                });
            }, 2000);
            load();
        } catch {
            setUploadingFolders((prev) => ({
                ...prev,
                [folderId]: { folderId, progress: 0, state: "error" },
            }));
        }
    };

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                <BreadCrumb
                    links={[
                        { name: "クラス管理", link: "/mentor/classes" },
                        { name: className || classId, link: `/mentor/classes/${classId}` },
                        { name: "授業資料フォルダ", link: "" },
                    ]}
                />

                <HorizontalStackContainer className="justify-between">
                    <h1>授業資料フォルダ</h1>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-400 transition-colors"
                        onClick={() => setShowNewFolder(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                        フォルダ作成
                    </button>
                </HorizontalStackContainer>

                {/* 新規フォルダ作成フォーム */}
                {showNewFolder && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h4 className="mb-4 text-blue-800">新規フォルダの作成</h4>
                        <VerticalStackContainer space={4}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    フォルダ名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="例: 数学I・第3章 三角関数"
                                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    科目 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newFolderSubject}
                                    onChange={(e) => setNewFolderSubject(e.target.value)}
                                    placeholder="例: 数学I"
                                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <HorizontalStackContainer space={2} className="justify-end">
                                <button
                                    className="px-4 py-2 text-sm border border-zinc-200 rounded-lg hover:bg-zinc-50"
                                    onClick={() => { setShowNewFolder(false); setNewFolderName(""); setNewFolderSubject(""); }}
                                >
                                    キャンセル
                                </button>
                                <button
                                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleCreateFolder}
                                    disabled={creating || !newFolderName.trim() || !newFolderSubject.trim()}
                                >
                                    {creating ? "作成中..." : "作成する"}
                                </button>
                            </HorizontalStackContainer>
                        </VerticalStackContainer>
                    </div>
                )}

                {loading ? (
                    <VerticalStackContainer space={2}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-zinc-100 rounded-lg animate-pulse" />
                        ))}
                    </VerticalStackContainer>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <button className="mt-2 text-sm text-blue-500 underline" onClick={load}>再試行</button>
                    </div>
                ) : folders.length === 0 ? (
                    <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
                        <FontAwesomeIcon icon={faFolderOpen} className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <p className="text-zinc-500 font-medium">授業資料フォルダがまだありません</p>
                        <p className="text-sm text-zinc-400 mt-1">
                            「フォルダ作成」から授業ごとのフォルダを追加してください
                        </p>
                    </div>
                ) : (
                    <VerticalStackContainer space={2}>
                        {folders.map((folder) => {
                            const uploadInfo = uploadingFolders[folder.id];
                            return (
                                <FolderRow
                                    key={folder.id}
                                    folder={folder}
                                    onDelete={handleDeleteFolder}
                                    onUpload={handleUpload}
                                    uploadProgress={uploadInfo?.progress ?? null}
                                    uploadState={uploadInfo?.state ?? "idle"}
                                />
                            );
                        })}
                    </VerticalStackContainer>
                )}
            </VerticalStackContainer>
        </SideBar>
    );
}
