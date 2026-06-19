"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BaseButton } from "@/components/ui/atoms/Button";

type ConfirmDialogProps = {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    isLoading?: boolean;
};

export const ConfirmDialog = ({
    isOpen,
    setIsOpen,
    title,
    message,
    confirmLabel = "削除",
    cancelLabel = "キャンセル",
    onConfirm,
    isLoading = false,
}: ConfirmDialogProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isLoading && setIsOpen(false)}
                    />
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
                            <p className="text-sm text-zinc-500 mb-6">{message}</p>
                            <div className="flex gap-3 justify-end">
                                <BaseButton
                                    color="white"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 text-sm"
                                >
                                    {cancelLabel}
                                </BaseButton>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50 cursor-pointer transition-colors"
                                >
                                    {isLoading ? "処理中..." : confirmLabel}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
