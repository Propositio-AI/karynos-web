import React from 'react';
import { CheckCircle, Trash2, X, Check } from 'lucide-react';

type Props = {
  isEditMode: boolean;
  selectedCount: number;
  onToggleEditMode: () => void;
  onDelete: () => void;
};

export const ChatListHeader: React.FC<Props> = ({ 
  isEditMode, 
  selectedCount, 
  onToggleEditMode, 
  onDelete 
}) => {
  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 z-20 transition-all">
      <div className="flex items-center gap-2">
        {isEditMode && (
          // 編集モード時は「キャンセル（×）」ボタンを左に出すか、
          // あるいはタイトルを「n件選択中」に変えるのが一般的です
          <button onClick={onToggleEditMode} className="mr-1">
            <X className="w-6 h-6 text-slate-900" />
          </button>
        )}
        <h1 className="text-xl font-bold text-slate-900">
          {isEditMode ? `${selectedCount}件選択` : 'チャット一覧'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {isEditMode ? (
          <>
            {/* 削除ボタン (選択があるときだけ赤くするなどの制御も可) */}
            <button 
              onClick={onDelete} 
              disabled={selectedCount === 0}
              className={`transition-colors ${selectedCount > 0 ? 'text-red-500' : 'text-zinc-300'}`}
              aria-label="削除"
            >
              <Trash2 className="w-6 h-6" />
            </button>

            {/* 完了(チェック)ボタン = 編集モード終了 */}
            <button onClick={onToggleEditMode} className="text-emerald-500" aria-label="完了">
              <Check className="w-6 h-6" />
            </button>
          </>
        ) : (
          // 通常モード：編集モードに入るボタン
          <button onClick={onToggleEditMode} className="text-slate-900" aria-label="編集">
            <CheckCircle className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
};