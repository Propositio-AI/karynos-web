'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useChatList } from '@/hooks/features/chat/useChatList';
import { ChatListHeader } from '@/components/features/chat/ChatListHeader';

// --- 日付フォーマット用のヘルパー関数 ---
const formatLastMessageDate = (dateString: string) => {
    if (!dateString) return '';
    const utcDateString = dateString.match(/Z|[+-]\d{2}:\d{2}$/) 
        ? dateString 
        : `${dateString}Z`;

    const date = new Date(utcDateString);
    const now = new Date();
    
    const isToday = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (isToday) {
        return `${hours}:${minutes}`;
    } else {
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }
};

export default function ChatListPage() {
    const { conversations, loading } = useChatList();

    // ソートロジック
    const sortedConversations = useMemo(() => {
        return [...conversations].sort((a, b) => {
            const dateA = new Date(a.last_message_at).getTime();
            const dateB = new Date(b.last_message_at).getTime();
            return dateB - dateA;
        });
    }, [conversations]);

    return (
        <div className="min-h-screen bg-canvas font-sans pb-20">
            
            {/* ヘッダー */}
            {/* // ヘッダーの編集機能関連をコメントアウト */}
            <ChatListHeader 
                isEditMode={false}
                selectedCount={0}
                onToggleEditMode={() => {}}
                onDelete={() => {}}
            />

            {/* グリッドレイアウト */}
            <main className="pt-14 px-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin h-6 w-6 border-2 border-brand-600 border-t-transparent rounded-full" />
                    </div>
                ) : sortedConversations.length === 0 ? (
                    <div className="p-8 text-center text-subtle text-sm">
                        チャット履歴がありません。
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {sortedConversations.map((conv) => (
                            <Link
                                key={conv.conversation_id}
                                href={`/chat/${conv.conversation_id}`}
                                className="group"
                            >
                                <div className="h-full bg-surface rounded-(--radius-md) border border-line p-4 hover:border-brand-300 transition-all cursor-pointer">
                                    <div className="flex flex-col h-full">
                                        <h3 className="text-sm font-bold text-ink truncate mb-2 line-clamp-2">
                                            {conv.job_name}
                                        </h3>
                                        <p className="text-xs text-muted mb-3 flex-grow">
                                            {conv.assistant_name}
                                        </p>
                                        <div className="text-xs text-subtle text-right">
                                            {formatLastMessageDate(conv.last_message_at)}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}