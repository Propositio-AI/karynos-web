"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faTimesCircle,
    faExclamationTriangle,
    faInfoCircle,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
    id: string;
    message: string;
    type: ToastType;
};

const styleMap: Record<ToastType, { bg: string; icon: typeof faCheckCircle; iconColor: string }> = {
    success: { bg: "bg-white border-l-4 border-emerald-500", icon: faCheckCircle, iconColor: "text-emerald-500" },
    error: { bg: "bg-white border-l-4 border-red-500", icon: faTimesCircle, iconColor: "text-red-500" },
    warning: { bg: "bg-white border-l-4 border-yellow-400", icon: faExclamationTriangle, iconColor: "text-yellow-400" },
    info: { bg: "bg-white border-l-4 border-blue-500", icon: faInfoCircle, iconColor: "text-blue-500" },
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
    const style = styleMap[toast.type];

    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), 4000);
        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-3 min-w-72 max-w-sm px-4 py-3 rounded-lg shadow-lg border border-zinc-200 ${style.bg}`}
        >
            <FontAwesomeIcon icon={style.icon} className={`h-4 w-4 shrink-0 ${style.iconColor}`} />
            <p className="flex-1 text-sm text-slate-800">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label="閉じる"
            >
                <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
            </button>
        </motion.div>
    );
};

export const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) => {
    return (
        <div className="fixed bottom-28 right-4 z-[200] flex flex-col gap-2 items-end" aria-live="polite">
            <AnimatePresence>
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onRemove={onRemove} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(({ message, type }: { message: string; type: ToastType }) => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, showToast, removeToast };
};
