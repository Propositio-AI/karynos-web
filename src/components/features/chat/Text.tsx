import { VerticalStackContainer } from "@/components/ui/molecules/Container";

export const ChatMessage = ({message, isUser}: {message: string, isUser: boolean}) => {
    return (
        <div className="w-full">
            {isUser ? (
                 <div className="bg-emerald-500 max-w-2/3 p-3 rounded-lg my-2 text-white ml-auto">
                    <p>{message}</p>
                </div>
            ) :  (  
                <div className="bg-white max-w-2/3 p-3 rounded-lg my-2 text-slate-900 mr-auto">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}

export const ChatContainer = ({className=""}: {className?: string}) => {
    return(
        <VerticalStackContainer space={4} className={`p-4 bg-zinc-100 w-full ${className}`}>
            <ChatMessage message="Hello, how can I help you?" isUser={true}/>
            <ChatMessage message="I'm looking for information on your services."  isUser={false}/>
            <ChatMessage message="Sure, I can help with that!" isUser={false}/>
        </VerticalStackContainer>
    )
}