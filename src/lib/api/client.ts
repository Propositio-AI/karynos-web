import { getChat } from "./gen/chat/chat";
import { getJob } from "./gen/job/job";
import { getDreamer } from "./gen/dreamer/dreamer";
import { getOnboarding } from "./gen/onboarding/onboarding";
import { getMatching } from "./gen/matching/matching";
import { streamChatMessageApiV1ChatMessageConversationIdPost } from "./stream";

export const api = {
	...getChat(),
	...getJob(),
	...getDreamer(),
	...getOnboarding(),
	...getMatching(),
	streamChatMessageApiV1ChatMessageConversationIdPost,
};
