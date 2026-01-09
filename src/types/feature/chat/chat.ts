export type RoleType = 'user' | 'assistant' | 'system';

export type Message = {
  message_id: string;
  role: RoleType;
  text_content: string;
  created_at: string;
};

// コンポーネントの表示用に整形した後の型
export type ChatUIModel = {
  id: string;
  text: string;
  isMyMessage: boolean; // role === 'user' かどうか
};