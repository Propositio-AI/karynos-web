import React, {  KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

type Props = {
  inputText: string;
  isLoading: boolean; // 送信中かどうか
  onChange: (value: string) => void;
  onSend: () => void;
};

export const ChatInputArea: React.FC<Props> = ({ inputText, isLoading, onChange, onSend }) => {
  
  // Enterキーでの送信ハンドリング（Shift+Enterは改行）
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 p-3 z-20 pb-safe">
      <div className="flex items-center gap-2 max-w-3xl mx-auto">
        <input
          type="text"
          value={inputText}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="テキストを入力してください"
          disabled={isLoading}
          className="flex-1 bg-zinc-50 border border-zinc-200 text-slate-800 placeholder-zinc-400 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
        />
        
        <button
          onClick={onSend}
          disabled={!inputText.trim() || isLoading}
          className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          aria-label="送信"
        >
          {/* アイコンの角度調整で紙飛行機感を出す */}
          <Send className="w-5 h-5 transform -rotate-12 translate-x-[-2px] translate-y-[2px]" />
        </button>
      </div>
    </footer>
  );
};