'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/features/chat/useChat';
import { ChatHeader } from '@/components/features/chat/ChatHeader';
import { MessageBubble } from '@/components/features/chat/MessageBubble';
import { ChatInputArea } from '@/components/features/chat/ChatInputArea';
import { useParams } from 'next/navigation';

type Props = {
  params: {
    conversationId: string;
  };
};

export default function ChatDetailPage() {
	const params = useParams();
	const conversationId = params.conversation_id as string;

	const { 
		messages, 
		title, 
		isSending, 
		loading, 
		sendMessage,
		deleteMessage
	} = useChat(conversationId);

	const [inputText, setInputText] = useState('');
	
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = async () => {
		if (!inputText.trim()) return;
		
		const textToSend = inputText;
		setInputText(''); // 送信ボタンを押したら即座にクリア
		
		await sendMessage(textToSend);
	};

	return (
		<div className="flex flex-col h-screen bg-zinc-50 font-sans overflow-hidden">
			
			{/* ヘッダー */}
			<ChatHeader title={title} />

			{/**/}
			<main className="flex-1 overflow-y-auto pt-14 pb-24 touch-action-manipulation pb-50">
				<div className="px-4 py-4 min-h-full flex flex-col justify-end">
					{/* ローディング表示 */}
					{loading && messages.length === 0 && (
						<div className="flex justify-center py-10">
						<div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
						</div>
					)}

					{/* メッセージリスト */}
					<div className="space-y-4">
						{messages.map((msg) => (
						<MessageBubble 
							key={msg.id} 
							message={msg}
							onDelete={deleteMessage}
						/>
						))}
					</div>

					{/* 自動スクロールのアンカー（ここが見えるようにスクロールされる） */}
					<div ref={bottomRef} className="h-4" />
				</div>
			</main>

			{/* 入力エリア (固定) */}
			<ChatInputArea 
				inputText={inputText}
				isLoading={isSending}
				onChange={setInputText}
				onSend={handleSend}
			/>
		</div>
	);
}