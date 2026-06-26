import { KeyboardEvent } from "react";
import { Send } from "lucide-react";

type Props = {
    inputText: string;
    isLoading: boolean;
    onChange: (value: string) => void;
    onSend: () => void;
};

export const ChatInputArea = ({ inputText, isLoading, onChange, onSend }: Props) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (inputText.trim() && !isLoading) {
                onSend();
            }
        }
    };

    return (
        <footer className="fixed inset-x-0 bottom-[92px] z-30 border-t border-line bg-surface/95 px-3 py-3 shadow-lift backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="メッセージを入力"
                    disabled={isLoading}
                    className="min-h-12 flex-1 rounded-full border border-line bg-stone-50 px-5 py-3 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand-500 focus:bg-surface focus:ring-4 focus:ring-brand-100 disabled:opacity-50"
                />

                <button
                    onClick={onSend}
                    disabled={!inputText.trim() || isLoading}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-brand transition hover:bg-brand-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
                    aria-label="送信"
                >
                    <Send className="h-5 w-5 -translate-x-0.5 translate-y-0.5 -rotate-12" />
                </button>
            </div>
        </footer>
    );
};
