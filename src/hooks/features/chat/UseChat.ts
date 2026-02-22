import { useState, useEffect, useCallback } from 'react';
import APIcall from '@/lib/api-client/api-call';
import { streamApiCall } from '@/lib/api-client/stream-api-call';
import { ChatUIModel, Message, RoleType } from '@/types/feature/chat/chat';

const Chat_BACKEND_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8080/chat"; 

// ★バックエンドからの返却型を定義
type ConversationResponse = {
	conversation: {
		job_name: string;
		// 他に必要なフィールドがあれば追加
	};
	messages: Message[];
};

export const useChat = (conversationId: string) => {
	const [messages, setMessages] = useState<ChatUIModel[]>([]);
	const [title, setTitle] = useState<string>(''); 
	const [loading, setLoading] = useState(true);
	const [isSending, setIsSending] = useState(false);

	const convertToUIModel = (msg: Message): ChatUIModel => ({
		id: msg.message_id,
		text: msg.text_content,
		isMyMessage: msg.role === 'user',
	});

	const fetchChatData = useCallback(async () => {
		setLoading(true);

		await APIcall<null, ConversationResponse>(
			"GET",
			`${Chat_BACKEND_URL}/api/v1/conversation/${conversationId}`,
			undefined,
			async(result) => {
				const { data } = result;
				setTitle(data.conversation.job_name);
				
				const uiMessages = data.messages.map(convertToUIModel);
				setMessages(uiMessages);
			}
		);

		setLoading(false);
	}, [conversationId]);

	useEffect(() => {
		if (conversationId) {
		fetchChatData();
		}
	}, [conversationId, fetchChatData]);

	const sendMessage = async (text: string) => {
		if (isSending || !text.trim()) return;
		setIsSending(true);

		// 楽観的更新
		const tempUserMsgId = `temp-${Date.now()}`;
		const userMsgUI: ChatUIModel = {
			id: tempUserMsgId,
			text: text,
			isMyMessage: true,
		};

		const aiMsgId = `ai-${Date.now()}`;
		const initialAiMsg: ChatUIModel = {
			id: aiMsgId,
			text: "",
			isMyMessage: false,
		};

		setMessages((prev) => [...prev, userMsgUI, initialAiMsg]);

		// ストリーミング送信
		await streamApiCall({
			url: `${Chat_BACKEND_URL}/api/v1/message/${conversationId}`,
			body: {
				role: 'user',
				text_content: text
			},
			onChunk: (chunk) => {
				setMessages((prev) => {
					const newMessages = [...prev];
					const lastMsgIndex = newMessages.length - 1;
					
					const lastMessage = newMessages[lastMsgIndex];

					if (lastMessage) {
						newMessages[lastMsgIndex] = {
							...lastMessage,
							text: lastMessage.text + chunk
						};
					}
					
					return newMessages;
				});
			},
			onComplete: async() => {
				setIsSending(false);
			},
			onError: async (err) => {
				console.error("AI stream error", err);
				setIsSending(false);
				// エラー時はメッセージを消すなどの処理
				setMessages((prev) => prev.filter(m => m.id !== tempUserMsgId && m.id !== aiMsgId));
			}
		});
	};

	const deleteMessage = async (messageId: string) => {
		// 楽観的削除: 成功・失敗を待たずにUIから消す
		const backupMessages = [...messages];
		setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

		await APIcall(
			"DELETE",
			`${Chat_BACKEND_URL}/api/v1/message/${messageId}` // パスのみ
		);
	};

	return {
		messages,
		title, // ★ここに追加したことで page.tsx のエラーが消えます
		loading,
		isSending,
		sendMessage,
		deleteMessage,
		refresh: fetchChatData 
	};
};