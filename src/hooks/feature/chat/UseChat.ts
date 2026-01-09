import { useState, useEffect, useCallback } from 'react';
import { APIcall } from '@/lib/api-client/api-call'; 
import { streamApiCall } from '@/lib/api-client/stream-api-call';
import { ChatUIModel, Message, RoleType } from '@/types/feature/chat/chat';

const MY_USER_ID = "11111111-1111-1111-1111-111111111111";
// 環境変数から読むか、パスのみにする（api-call側で結合している場合）
const Chat_BACKEND_URL = "5041/api/v1/chat"; 

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
  // ★初期値を空文字にしておく
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

    // ★修正: 1回のAPIコールで「タイトル」と「履歴」両方を取得
    await APIcall<null, ConversationResponse>(
      "GET",
      // api-call側でBASE_URLをつけるならここはパスだけでOKですが、
      // 現在のコードに合わせて変数を使います
      `${Chat_BACKEND_URL}/conversation/${conversationId}`,
      undefined,
      (data) => {
        // 1. タイトル(職業名)をセット
        setTitle(data.conversation.job_name);
        
        // 2. メッセージをセット
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
      url: `${Chat_BACKEND_URL}/message/${conversationId}`,
      body: {
        sender_id: MY_USER_ID,
        role: 'user',
        text_content: text
      },
      onChunk: (chunk) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsgIndex = newMessages.length - 1;
          
          // ★修正: undefinedチェックを入れてTSエラーを回避
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
      onComplete: () => {
        setIsSending(false);
      },
      onError: (err) => {
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

    const success = await APIcall(
      "DELETE",
      `${Chat_BACKEND_URL}/message/${messageId}` // パスのみ
    );

    // 失敗したら元に戻す
    if (!success) {
      alert("削除に失敗しました");
      setMessages(backupMessages);
    }
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