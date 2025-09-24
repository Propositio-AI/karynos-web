"use client"

import { useEffect, useRef, useState } from "react";

import { CenterContainer } from "@/components/ui/molecules/Container"
import { BaseInputText } from "@/components/ui/atoms/Input"
import { HorizontalStackContainer } from "@/components/ui/molecules/Container"
import { IoIosSend } from "react-icons/io";
import { IconButton } from "@/components/ui/atoms/Button";
import { useRouter } from "next/navigation";
import { WebSocket_CALL } from "@/lib/api-client/websocket-call";
import { IoIosArrowRoundForward  } from "react-icons/io";
import { motion } from "framer-motion"
import { API_CALL } from "@/lib/api-client/api-call";
import { QueryTableType, QueryType } from "@/types/table/query";
import { ArchiveTableType, ArchiveType } from "@/types/table/archive";

export const TextBook = () => {
    const [query, setQuery] = useState<string>("三角関数")
    const [currentQuery, setCurrentQuery] = useState("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [plan, setPlan] = useState<string[]>([]) // TODO: 今は実験のために[]にしてるが、本来はArchive
    
    const wsRef = useRef<WebSocket_CALL<{query: string}, undefined, {"notions": string[]}, undefined> | null>(null)

    const router = useRouter();

    const sendQuery = async () => {
        setIsLoading((prev) => !prev)
        setPlan([])
        setCurrentQuery(query)
        wsRef.current?.send({
            query: query
        })
    }

    const createQuery = async (index: number) => {
        // 学習プランを新規レコードで保存
        await API_CALL<{qury: string, query_type: QueryType}, QueryTableType>(
            "POST",
            ":8060/api/v1/query",
            {
                data: {
                    qury: query,
                    query_type: "TEXTBOOK"
                }
            },

            // Success
            async (data: QueryTableType) => {
                const query_id = data.id

                if(await savePlanArchive(query_id)){
                    console.log(query_id)

                    const result = await createTextBookArchive(query_id, index)
                    console.log(result)
                    if(result) router.push(`./textbook/${query_id}`)
                    else{
                        // 教科書レコードの生成に失敗
                    }
                }else{
                    // 学習プランの保存に失敗
                }
            },

            // Error
            async(code: string, message: string) => {
                console.log(message)
            }
        )
    }

    const savePlanArchive = async (query_id: string): Promise<boolean> => {
        return await API_CALL<{query_id: string, archive_type: ArchiveType, contents: {notions: string[]}}, ArchiveTableType>(
            "POST",
            ":8010/api/v1/archive",
            {
                data: {
                    query_id: query_id,
                    archive_type: "PLAN",
                    contents: {
                        notions: plan
                    }
                }
            },
            async (data: ArchiveTableType) => {
                console.log(data)
            },
            async () => {

            }
        )
    } 

    const createTextBookArchive = async (query_id: string, index: number): Promise<boolean> => {
        let flag = true

        // 学習プランに基づいて教科書レコードを作成
        plan.map(async (notion, i) => {
            const result = await API_CALL<{query_id: string, archive_type: ArchiveType, contents: {notion: string, structures: string[], elements: string[]}}, ArchiveTableType>(
                "POST",
                ":8010/api/v1/archive",
                {
                    data: {
                        query_id: query_id,
                        archive_type: "TEXTBOOK",
                        contents: {
                            notion: notion,
                            structures: [],
                            elements: []
                        }
                    }
                },

                // Success
                async (data: ArchiveTableType) => {

                }, 

                // Error
                async (code :string, message: string) => {

                }
            )

            flag = flag && result
        })

        return flag
    }

    useEffect(() => {        
        wsRef.current = new WebSocket_CALL<{query: string}, undefined, {"notions": string[]}, undefined>(
            "ws://localhost:8060/ws/v1/query/plan",
            
            // Start
            () => {},

            // Stream
            async ({notions}: {notions: string[]}) => {
                setPlan(notions)
            }, 
            
            // End
            () => {
                setIsLoading(false)
            },

            // Error
            () => {}
        );

    },[])

    return (
        <CenterContainer className="h-screen w-full">
            <div className="w-1/2">
                <h2 className="text-center">何を学びますか？</h2>
                <div className={`flex flex-wrap items-start gap-4 p-4 my-5 ${currentQuery != "" ? "h-[50vh]" : ""}`}>
                    {plan.map((notion, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}   
                            animate={{ opacity: 1, y: 0 }}    
                            transition={{ duration: 0.5, delay: i * 0.1 }} 
                        >
                            <HorizontalStackContainer onClick={() => createQuery(i)}>
                                <div className="w-32 p-2 h-48 text-center cursor-pointer roudned-2xl hover:shadow-xl">
                                    <div className="flex mx-auto my-6 rounded-full w-8 h-8 items-center justify-center bg-gray-100">
                                        <p className="text-sm font-bold p-2">{i + 1}</p>
                                    </div>
                                    <p className="text-sm font-bold">{notion}</p>
                                </div>
                                {i + 1 < plan.length && (
                                    <IoIosArrowRoundForward size={"32"}/>
                                )}
                            </HorizontalStackContainer>
                        </motion.div>
                    ))}
                </div>
                <HorizontalStackContainer space={1}>
                    <BaseInputText className="w-full my-8 rouded-full" placeholder="三角関数について教えて" value={query} onChange={(e) => setQuery(e.target.value)}/>
                    <IconButton color="white" className="!rounded-full hover:!bg-gray-100" icon={<IoIosSend size={"100%"}/>} onClick={sendQuery} isLoading={isLoading}/>
                </HorizontalStackContainer>
            </div>
        </CenterContainer>
    )
}

export default TextBook