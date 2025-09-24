import { ChatMessageCard } from "../molecules/Card"
import { HorizontalStackContainer } from "../molecules/Container"
import { BaseInputText } from "../atoms/Input"
import { IconButton } from "../atoms/Button"
import { useEffect, useRef, useState } from "react"
import { QueryTableType } from "@/types/table/query"
import { API_CALL } from "@/lib/api-client/api-call"
import { WebSocket_CALL } from "@/lib/api-client/websocket-call"
import { IoIosArrowRoundUp  } from "react-icons/io"
import { ArchiveTableType } from "@/types/table/archive"



export const ChatBox = ({query_id}: {query_id: string}) => {
    const [chatMessages, setChatMessages] = useState<[QueryTableType, ArchiveTableType | null][]>([])
    const [message, setMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const wsRef = useRef<WebSocket_CALL<QueryTableType, undefined, {contents: {message: string}}, null> | null>(null)
    const chatContainer = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        (async () => {
            // 過去のチャット履歴を取得
            await API_CALL<{parent_id: string, query_type: string}, QueryTableType[]>(
                "GET",
                ":8060/api/v1/query",
                {
                    params: {
                        parent_id: query_id,
                        query_type: "CHAT"
                    }
                },

                // Success
                async (data: QueryTableType[]) => {
                    setChatMessages(data.map(q => [q, null]));
                },

                // Error
                async (code: string, message: string) => {
                    console.log(code, message)
                }
            )
        })()
        
        // 推論用WebSocketを定義
        wsRef.current = new WebSocket_CALL<QueryTableType, undefined, {contents: {message: string}}, null>(
            "ws://localhost:8060/ws/v1/query/chat",
            
            // Start
            async () => {},
            
            // Stream
            (data: {contents: {message: string}}) => {                
                setChatMessages(prev => {
                    const lastIndex = prev.length - 1
                    const last = prev[lastIndex]
                    if(!last) return prev

                    const [query, archive]: [QueryTableType, ArchiveTableType | null] = last;
                    const mergedArchive: ArchiveTableType = {
                        ...(archive || {}),
                        ...data as ArchiveTableType
                    };

                    return [
                        ...prev.slice(0, lastIndex),
                        [query, mergedArchive]
                    ];
                })
            },

            // End
            async () => {
                setIsLoading(false)
                setMessage("")
            },

            //Error
            () => {

            }
        )

        keepBottom()
    }, [])

    const sendMessage = async() => {
        setIsLoading(true)    

        // クエリーを作成
        await API_CALL<{query: string, parent_id: string, query_type: string}, QueryTableType>(
            "POST",
            ":8060/api/v1/query",
            {
                data:{
                    query: message,
                    parent_id: query_id,
                    query_type: "CHAT",
                }
            },

            // Success
            async (query: QueryTableType) => {
                // クエリーと仮アーカイブを設定
                setChatMessages(prev => [...prev, [query, {contents: {message: ""}} as ArchiveTableType]])
                
                // 推論をリクエスト
                wsRef.current?.send(query)
            },

            // Error
            async (code: string, message: string) => {
                console.log(code, message)
            }
        )
    }

    const keepBottom = () => {
        const container = chatContainer.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    }

    useEffect(() => { 
        keepBottom()
    },[chatMessages])

    return(
        <>
            <div className="h-[90%] p-2 overflow-y-auto" ref={chatContainer}>
                {chatMessages.map((messages: [QueryTableType, ArchiveTableType | null], index) => (
                    <ChatMessageCard key={index} query={messages[0]} archive={messages[1]}/>
                ))}
            </div>
            <HorizontalStackContainer space={4} className="">
                <BaseInputText className="w-full !rounded-full" placeholder="質問する" onChange={(e) => setMessage(e.target.value)} value={message}/>
                <IconButton icon={<IoIosArrowRoundUp size={"100%"}/>} className="!p-1 !rounded-full" onClick={sendMessage} isLoading={isLoading}/>
            </HorizontalStackContainer>
        </>
    )
}