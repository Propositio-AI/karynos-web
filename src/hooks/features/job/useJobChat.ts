import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import type { Conversation } from '@/hooks/features/chat/UseChatList';

export const useJobChat = () => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    const startChatForJob = async (jobId: number) => {
        setIsCreating(true);

        try {
            const newConv = await api.createNewConversationApiV1ChatPost({ job_id: jobId.toString() });
            const conversation = newConv as Conversation;
            router.push(`/chat/${conversation.conversation_id}`);
        } catch (error) {
            console.error('チャット作成エラー:', error);
            alert('チャットの作成に失敗しました');
        } finally {
            setIsCreating(false);
        }
    };

    return { startChatForJob, isCreating };
};
