export type RoleType = 'user' | 'assistant' | 'system';

export type Message = {
    message_id: string;
    role: RoleType;
    text_content: string;
    created_at: string;
};

export type ChatUIModel = {
    id: string;
    text: string;
    isMyMessage: boolean;
};
