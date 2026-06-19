"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/features/chat/UseChat";
import { ChatHeader } from "@/components/features/chat/ChatHeader";
import { MessageBubble } from "@/components/features/chat/MessageBubble";
import { ChatInputArea } from "@/components/features/chat/ChatInputArea";

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
		<div className="flex flex-col h-screen bg-zinc-50 font-sans overflow-hidden">
			<ChatHeader title={title} />

			<main className="flex-1 overflow-y-auto pt-14 pb-24 touch-action-manipulation pb-50">
				<div className="px-4 py-4 min-h-full flex flex-col justify-end">
					{loading && messages.length === 0 && (
						<div className="flex justify-center py-10">
							<div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
						</div>
					)}

					<div className="space-y-4">
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
