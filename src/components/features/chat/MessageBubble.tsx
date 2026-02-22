import React from 'react';
import { Trash2 } from 'lucide-react';
import { ChatUIModel } from '@/types/feature/chat/chat'; // パスは環境に合わせて調整してください

type Props = {
  message: ChatUIModel;
  onDelete: (messageId: string) => void; // ★追加
};

export const MessageBubble: React.FC<Props> = ({ message, onDelete }) => {
  const { id, isMyMessage, text } = message;

  return (
    // 全体を flex コンテナにする
    // 自分(isMyMessage): flex-row-reverse (右寄せ & アイコンを左側に)
    // 相手(!isMyMessage): flex-row (左寄せ & アイコンを右側に)
    // items-end: バブルの下とアイコンを揃える
    <div className={`flex w-full mb-4 items-end gap-2 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* メッセージバブル本体 */}
      <div
        className={`
          max-w-[70%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap shadow-sm leading-relaxed
          ${isMyMessage 
            ? 'bg-emerald-500 text-white rounded-tr-sm' 
            : 'bg-white text-slate-800 rounded-tl-sm'
          }
        `}
      >
        {text}
      </div>

      {/* 削除ボタン（ゴミ箱） */}
      <button
        onClick={() => {
          if (confirm('このメッセージを削除しますか？')) {
            onDelete(id);
          }
        }}
        className="text-zinc-300 hover:text-red-400 transition-colors p-1"
        aria-label="削除"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      
    </div>
  );
};