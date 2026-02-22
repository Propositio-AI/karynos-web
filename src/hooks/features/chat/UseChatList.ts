import { useState, useCallback, useEffect } from 'react';
import APIcall from '@/lib/api-client/api-call';

export type Conversation = {
    conversation_id: string;
    job_name: string;
    assistant_name: string;
    last_message_at: string;
};

const BACKEND_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8080/chat";

export const useChatList = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. 一覧取得
    const fetchConversations = useCallback(async () => {
        setLoading(true);
        try {
            await APIcall<null, Conversation[]>(
                "GET",
                `${BACKEND_API_URL}/api/v1/history`, 
                undefined,
                (response) => setConversations(response.data)
            );
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // // 2. 削除機能 (一時コメントアウト)
    // const deleteConversation = async (conversationId: string) => {
    //     const backup = [...conversations];
    //     setConversations((prev: Conversation[]) => prev.filter((c: Conversation) => c.conversation_id !== conversationId));

    //     try {
    //         await APIcall(
    //             "DELETE",
    //             `${BACKEND_API_URL}/api/v1/conversation/${conversationId}`
    //         );
    //     } catch (error) {
    //         console.error('Failed to delete conversation:', error);
    //         // エラー時は元の状態に戻す
    //         setConversations(backup);
    //     }
    // };

    return {
        conversations,
        loading,
        // deleteConversation,
        refresh: fetchConversations
    };
};