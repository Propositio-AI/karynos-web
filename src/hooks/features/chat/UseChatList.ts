import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api/client';

export type Conversation = {
    conversation_id: string;
    job_name: string;
    assistant_name: string;
    last_message_at: string;
};

export const useChatList = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.getConversationHistoryApiV1ChatHistoryGet();
            setConversations((response as Conversation[]) ?? []);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return {
        conversations,
        loading,
        refresh: fetchConversations,
    };
};
