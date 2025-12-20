'use client';

import React, { useState, useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import { useChatList } from '@/hooks/feature/chat/UseChatList'; // パスは実際の環境に合わせてください
import { ChatListHeader } from '@/components/feature/chat/ChatListHeader';
import { ChatListItem } from '@/components/feature/chat/ChatListItem';

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
  const { conversations, loading, createConversation, deleteConversation } = useChatList();
  
  // モーダル関連
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputJobId, setInputJobId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // ★追加: 編集モードと選択状態
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ソートロジック
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const dateA = new Date(a.last_message_at).getTime();
      const dateB = new Date(b.last_message_at).getTime();
      return dateB - dateA;
    });
  }, [conversations]);

  // --- ハンドラー ---

  // 編集モード切替
  const handleToggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    setSelectedIds(new Set()); // モード切替時に選択リセット
  };

  // 選択トグル (ChatListItemから呼ばれる)
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 選択項目の削除実行
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    // 並列で削除リクエストを投げる
    await Promise.all(
      Array.from(selectedIds).map((id) => deleteConversation(id))
    );

    setIsEditMode(false);
    setSelectedIds(new Set());
  };

  // 新規作成
  const handleCreate = async () => {
    if (!inputJobId.trim()) return;
    setIsCreating(true);
    await createConversation(inputJobId);
    setIsCreating(false);
    setIsModalOpen(false);
    setInputJobId('');
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans pb-20">
      
      {/* ★ヘッダーをコンポーネント化 */}
      <ChatListHeader 
        isEditMode={isEditMode}
        selectedCount={selectedIds.size}
        onToggleEditMode={handleToggleEditMode}
        onDelete={handleDeleteSelected}
      />

      {/* --- リスト部分 --- */}
      <main className="pt-14 px-0 overflow-x-hidden"> {/* 横スクロール防止 */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        ) : sortedConversations.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 text-sm">
            チャット履歴がありません。<br />
            右下のボタンから作成してください。
          </div>
        ) : (
          <ul className="bg-white">
            {sortedConversations.map((conv) => (
              // ★リストアイテムをコンポーネント化
              <ChatListItem
                key={conv.conversation_id}
                conversation={conv}
                isEditMode={isEditMode}
                isSelected={selectedIds.has(conv.conversation_id)}
                onSelectToggle={handleSelectToggle}
                formatDate={formatLastMessageDate}
              />
            ))}
          </ul>
        )}
      </main>

      {/* --- FAB (新規作成ボタン) --- */}
      {/* 編集モード中は邪魔なので隠す */}
      {!isEditMode && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all z-20 animate-in fade-in zoom-in duration-200"
          aria-label="新規チャット作成"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      {/* --- 新規作成モーダル (変更なし) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-xs p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">
              新しい会話を始める
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-1">
                  求人ID (Job ID)
                </label>
                <input
                  type="text"
                  value={inputJobId}
                  onChange={(e) => setInputJobId(e.target.value)}
                  placeholder="例: 37"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  autoFocus
                />
              </div>
              <button
                onClick={handleCreate}
                disabled={!inputJobId || isCreating}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? '作成中...' : '会話を開始する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}