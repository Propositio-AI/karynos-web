"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/features/chat/useChat";
import { ChatHeader } from "@/components/features/chat/ChatHeader";
import { MessageBubble } from "@/components/features/chat/MessageBubble";
import { ChatInputArea } from "@/components/features/chat/ChatInputArea";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChatDetailPageContent() {
    const params = useParams();
    const conversationId = params.conversation_id as string;

    const { messages, title, isSending, loading, sendMessage, deleteMessage } =
        useChat(conversationId);

    const [inputText, setInputText] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const textToSend = inputText;
        setInputText("");

        await sendMessage(textToSend);
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-canvas">
            <ChatHeader title={title} />

            <main className="flex-1 overflow-y-auto pb-44 pt-16">
                <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-end px-4 py-4">
                    {loading && messages.length === 0 && (
                        <div className="flex justify-center py-10">
                            <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                        </div>
                    )}

                    {!loading && messages.length === 0 && (
                        <div className="flex flex-col items-center gap-3 py-16 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                                <FontAwesomeIcon icon={faComments} className="h-5 w-5 text-brand-700" />
                            </div>
                            <p className="text-sm font-semibold text-ink">
                                何か質問してみましょう
                            </p>
                            <p className="max-w-xs text-sm leading-6 text-muted">
                                仕事内容や働き方、必要なスキルなど、気になることを聞いてみてください。
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} onDelete={deleteMessage} />
                        ))}
                    </div>

                    <div ref={bottomRef} className="h-4" />
                </div>
            </main>

            <ChatInputArea
                inputText={inputText}
                isLoading={isSending}
                onChange={setInputText}
                onSend={handleSend}
            />
        </div>
    );
}
