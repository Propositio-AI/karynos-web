import { useState, useCallback, useEffect } from 'react';
import APIcall from '@/lib/api-client/api-call';

// 会話データの型定義 (バックエンドのレスポンスに合わせて調整)
export type Conversation = {
    conversation_id: string;
    job_name: string;
    assistant_name: string;
    last_message_at: string;
    // 他に必要なフィールドがあれば追加
};

const MY_USER_ID = "11111111-1111-1111-1111-111111111111"; // 仮
const BACKEND_API_URL = "5041/api/v1/chat";

export const useChatList = () => {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [loading, setLoading] = useState(true);

	// 1. 一覧取得
	const fetchConversations = useCallback(async () => {
		setLoading(true);
		await APIcall<null, Conversation[]>(
		"GET",
		`${BACKEND_API_URL}/history/${MY_USER_ID}`, // v1.pyの @router.get("/history/{user_id}")
		undefined,
			(data) => setConversations(data)
		);
		setLoading(false);
	}, []);

	// 初回ロード
	useEffect(() => {
		fetchConversations();
	}, [fetchConversations]);

	// 2. 新規作成
	const createConversation = async (jobId: string) => {
		return await APIcall<{ user_id: string; job_id: string }, Conversation>(
			"POST",
			`${BACKEND_API_URL}/`, // v1.pyの @router.post("/")
			{
				data: {
				user_id: MY_USER_ID,
				job_id: jobId
				}
			},
			(newConv) => {
				// 作成成功したらリストの先頭に追加
				fetchConversations();
			}
		);
  };

  // 3. 削除
  const deleteConversation = async (conversationId: string) => {
		// 楽観的削除
		const backup = [...conversations];
		setConversations((prev) => prev.filter(c => c.conversation_id !== conversationId));

		const success = await APIcall(
		"DELETE",
		`${BACKEND_API_URL}/conversation/${conversationId}` // v1.pyの @router.delete("/conversation/{id}")
		);

		if (!success) {
			alert("削除に失敗しました");
			setConversations(backup); // ロールバック
		}
	};

	return {
		conversations,
		loading,
		createConversation,
		deleteConversation,
		refresh: fetchConversations
	};
};