import { Trash2 } from "lucide-react";
import type { ChatUIModel } from "@/types/feature/chat/chat";

type Props = {
	message: ChatUIModel;
	onDelete: (messageId: string) => void;
};

export const MessageBubble = ({ message, onDelete }: Props) => {
	const { id, isMyMessage, text } = message;

	return (
		<div
			className={`flex w-full items-end gap-2 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}
		>
			<div
				className={`max-w-[82%] whitespace-pre-wrap rounded-(--radius-md) px-4 py-3 text-sm leading-7 sm:max-w-[70%] ${
					isMyMessage
						? "bg-brand-500 text-white"
						: "border border-line bg-surface text-ink"
				}`}
			>
				{text || (!isMyMessage ? "..." : "")}
			</div>

			<button
				onClick={() => {
					if (confirm("このメッセージを削除しますか？")) {
						onDelete(id);
					}
				}}
				className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition hover:bg-red-50 hover:text-red-500"
				aria-label="削除"
			>
				<Trash2 className="h-4 w-4" />
			</button>
		</div>
	);
};
