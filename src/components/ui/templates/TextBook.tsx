import { SectionTitle } from "@/components/ui/atoms/Text"
import { BaseColumnCard } from "@/components/ui/molecules/Card"
import { API_CALL } from "@/lib/api-client/api-call";
import { WebSocket_CALL } from "@/lib/api-client/websocket-call";
import renderTextBook from "@/lib/textbook-compiler";
import { ArchiveTableType } from "@/types/table/archive";
import React, { useEffect, useRef, useState } from "react";
import { SimpleAnimatePing } from "../molecules/Animation";

export const TextBook = ({textbook}: {textbook: ArchiveTableType | null}) => {
    const WsRef = useRef<WebSocket_CALL<ArchiveTableType, undefined, {elements: any}, undefined>>(null)
    const [elements, setElements] = useState<any | null>([])
    const [elementNum, setElementNums] = useState(null)

    useEffect(() => {
        (async () => {
            WsRef.current = new WebSocket_CALL<ArchiveTableType, undefined, {elements: any}, undefined>(
                "ws://localhost:8010/ws/v1/archive/textbook",
                
                // Start
                () => {},

                // Stream
                async ({elements}: {elements: any}) => {
                    setElements(elements)
                }, 
                
                // End
                () => {},

                // Error
                () => {}
            )
        })()
    }, [])

    useEffect(() => {
        console.log(textbook)
        if(!textbook) return;  
        (async () => {
            setElementNums(textbook.contents.structures.length)

            switch(textbook.archive_status){
                case "PENDING":
                    await API_CALL<ArchiveTableType, ArchiveTableType>(
                        "POST",
                        ":8010/api/v1/archive/textbook/structure",
                        {
                            data: textbook
                        },
                        async (data: ArchiveTableType) => {
                            console.log(data)
                            setElementNums(data.contents.structures.length)
                            WsRef.current?.send(data)
                        },
                        async (code: string, message: string) => {
                            console.log(code)
                            console.log(message)
                        }
                    )
    
                    break;
                    
                    case "RUNNING":
                        // 生成開始
                        WsRef.current?.send(textbook)
                        break;
                    
                    case "SUCCEEDED":
    
                    break;
                    
                    case "CANCELLED":
                        
                    break;
                    
                case "FAILED":
                    
                    break
                }
        })()            
        setElements(textbook.contents.elements)
    }, [textbook])

    return(
        <>
            <div className="h-[95%] overflow-y-scroll">
                {elements.map((element, idx: number) => (
                    <div key={idx} className="text-md my-5">
                        {element.element}
                        { element.type == "Section" && (
                            <SectionTitle number={idx} title={element.title}/>
                            )
                        }
                        { element.type == "Definition" && (
                            <BaseColumnCard type="definition" title={element.title}>
                                {renderTextBook(element.text)}
                            </BaseColumnCard>
                            )
                        }
                        { element.type == "Theorem" && (
                            <BaseColumnCard type="theorem" title={element.title}>
                                {renderTextBook(element.text)}
                            </BaseColumnCard>
                            )
                        }
                        { element.type == "Formula" && (
                            <BaseColumnCard type="formula" title={element.title}>
                                {renderTextBook(element.text)}
                            </BaseColumnCard>
                            )
                        }
                        { element.type == "Column" && (
                            <BaseColumnCard type="column" title={element.title}>
                                {renderTextBook(element.text)}
                            </BaseColumnCard>
                            )
                        }
                        { element.type == "Text" && (
                            <React.Fragment>{renderTextBook(element.text)}</React.Fragment>
                            )
                        }
                        { element.type == "Exercise" && (
                            <BaseColumnCard type="example" title={element.title}>
                                {renderTextBook(element.question.question)}<br/>
                                {renderTextBook(element.answer.answer)}<br/>
                                {renderTextBook(element.question.explanation)}
                            </BaseColumnCard>
                            )
                        }
                    </div>
                ))}
                {Array.from({length: elementNum - elements.length}).map((_, index) => (
                    <div className="my-8" key={index}>
                        <div className="w-1/3 h-8 animate-pulse bg-gray-200 my-3" />
                        <div className="w-3/4 h-6 animate-pulse bg-gray-200 my-1" />
                        <div className="w-3/4 h-6 animate-pulse bg-gray-200 my-1" />
                        <div className="w-3/4 h-6 animate-pulse bg-gray-200 my-1" />
                        <div className="w-3/4 h-6 animate-pulse bg-gray-200 my-1" />
                        <div className="w-3/4 h-6 animate-pulse bg-gray-200 my-1" />
                        <div className="w-3/4 h-6 animate-pulse bg-gray-200 my-1" />
                    </div>
                ))}
                {(elementNum == null || elementNum == 0) && (
                    <div className="flex h-full items-center justify-center">
                        <div>
                            <SimpleAnimatePing/>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}