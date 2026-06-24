import { VerticalStackContainer } from "@/components/ui/molecules/Container";

export const ChatMessage = ({message, isUser}: {message: string, isUser: boolean}) => {
    return (
        <div className="w-full">
            {isUser ? (
                 <div className="bg-brand-600 max-w-2/3 p-3 rounded-(--radius-md) my-2 text-white ml-auto">
                    <p>{message}</p>
                </div>
            ) :  (
                <div className="bg-surface max-w-2/3 p-3 rounded-(--radius-md) my-2 text-ink mr-auto">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}

export const ChatContainer = ({className=""}: {className?: string}) => {
    return(
        <VerticalStackContainer space={4} className={`p-4 bg-canvas w-full ${className}`}>
            <ChatMessage message="Hello, how can I help you?" isUser={true}/>
            <ChatMessage message="I'm looking for information on your services."  isUser={false}/>
            <ChatMessage message="Sure, I can help with that!" isUser={false}/>
        </VerticalStackContainer>
    )
}