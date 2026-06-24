import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { Conversation } from '@/hooks/features/chat/useChatList';

type Props = {
  conversation: Conversation;
  isEditMode: boolean;
  isSelected: boolean;
  onSelectToggle: (id: string) => void;
  formatDate: (date: string) => string; // page.tsxのヘルパー関数を受け取る
};

export const ChatListItem: React.FC<Props> = ({
  conversation,
  isEditMode,
  isSelected,
  onSelectToggle,
  formatDate,
}) => {
  // リンクのクリックイベント制御
  // 編集モード中は画面遷移させず、選択トグルだけを行う
  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      onSelectToggle(conversation.conversation_id);
    }
  };

  return (
    <li className="relative border-b border-line last:border-none overflow-hidden bg-surface">
      
      {/* --- 左側の選択アイコン (背景に配置) --- */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-0">
        {isSelected ? (
          <div className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : (
          <Circle className="w-6 h-6 text-subtle" />
        )}
      </div>

      {/* --- メインコンテンツ (スライドする部分) --- */}
      <motion.div
        // 編集モードなら右に40pxずらす
        animate={{ x: isEditMode ? 40 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 bg-surface" // 背景色をつけないと後ろのアイコンが透けてしまう
      >
        <Link
          href={`/chat/${conversation.conversation_id}`}
          onClick={handleClick}
          className="block px-4 py-4 active:bg-canvas transition-colors"
        >
          <div className="flex justify-between items-baseline mb-1">
            <h2 className="text-base font-bold text-ink truncate pr-4">
              {conversation.job_name}
            </h2>
            <span className="text-xs text-subtle flex-shrink-0 font-medium">
              {formatDate(conversation.last_message_at)}
            </span>
          </div>
        </Link>
      </motion.div>
    </li>
  );
};