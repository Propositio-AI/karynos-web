import { useState } from 'react'
import { useRouter } from 'next/navigation'
import APIcall from '@/lib/api-client/api-call'
import { Conversation } from '@/hooks/features/chat/UseChatList'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8080/chat"

export const useJobChat = () => {
    const router = useRouter()
    const [isCreating, setIsCreating] = useState(false)

    const startChatForJob = async (jobId: number) => {
        setIsCreating(true)

        await APIcall<{ job_id: string }, Conversation>(
            "POST",
            `${BACKEND_API_URL}/api/v1/`,
            {
                data: {
                    job_id: jobId.toString()
                }
            },
            async (newConv) => {
                router.push(`/chat/${newConv.data.conversation_id}`)
            },
            async (error) => {
                console.error("チャット作成エラー:", error)
                alert(`チャットの作成に失敗しました: ${error.message}`)
                setIsCreating(false)
            }
        )
    }

    return {
        startChatForJob,
        isCreating
    }
}
