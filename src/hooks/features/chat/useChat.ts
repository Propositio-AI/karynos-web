import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api/client";
import type { ChatUIModel, Message } from "@/types/feature/chat/chat";

type ConversationResponse = {
	conversation: { job_name: string };
	messages: Message[];
};

export const useChat = (conversationId: string) => {
	const [messages, setMessages] = useState<ChatUIModel[]>([]);
	const [title, setTitle] = useState("");
	const [loading, setLoading] = useState(true);
	const [isSending, setIsSending] = useState(false);

	const convertToUIModel = (msg: Message): ChatUIModel => ({
		id: msg.message_id,
		text: msg.text_content,
		isMyMessage: msg.role === "user",
	});

	const fetchChatData = useCallback(async () => {
		setLoading(true);
		try {
			const data =
				await api.getConversationDetailsApiV1ChatConversationConversationIdGet(
					conversationId,
				);
			const response = data as ConversationResponse;
			setTitle(response.conversation.job_name);
			setMessages(response.messages.map(convertToUIModel));
		} finally {
			setLoading(false);
		}
	}, [conversationId]);

	useEffect(() => {
		if (conversationId) fetchChatData();
	}, [conversationId, fetchChatData]);

	const sendMessage = async (text: string) => {
		if (isSending || !text.trim()) return;
		setIsSending(true);

		const tempUserMsgId = `temp-${Date.now()}`;
		const aiMsgId = `ai-${Date.now()}`;

		setMessages((prev) => [
			...prev,
			{ id: tempUserMsgId, text, isMyMessage: true },
			{ id: aiMsgId, text: "", isMyMessage: false },
		]);

		await api.streamChatMessageApiV1ChatMessageConversationIdPost(
			conversationId,
			{ role: "user", text_content: text },
			{
				onChunk: (chunk) => {
					setMessages((prev) => {
						const next = [...prev];
						const last = next[next.length - 1];
						if (last) next[next.length - 1] = { ...last, text: last.text + chunk };
						return next;
					});
				},
				onComplete: async () => {
					setIsSending(false);
				},
				onError: async (err) => {
					console.error("AI stream error", err);
					setIsSending(false);
					setMessages((prev) =>
						prev.filter((m) => m.id !== tempUserMsgId && m.id !== aiMsgId),
					);
				},
			},
		);
	};

	const deleteMessage = async (messageId: string) => {
		const backup = [...messages];
		setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
		try {
			await api.deleteMessagesInConversationApiV1ChatMessageMessageIdDelete(messageId);
		} catch (err) {
			console.error("Failed to delete message:", err);
			setMessages(backup);
		}
	};

	return {
		messages,
		title,
		loading,
		isSending,
		sendMessage,
		deleteMessage,
		refresh: fetchChatData,
	};
};
