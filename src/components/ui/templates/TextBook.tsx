import { PageTitle, SectionTitle } from "@/components/ui/atoms/Text"
import { BaseColumnCard } from "@/components/ui/molecules/Card"
import { WebSocket_CALL } from "@/lib/api-client/websocket-call";
import renderTextBook from "@/lib/textbook-compiler";
import { ArchiveTableType } from "@/types/table/archive";
import React, { useEffect, useRef, useState } from "react";

export const TextBook = ({textbook}: {textbook: ArchiveTableType | null}) => {
    const WsRef = useRef<WebSocket_CALL<{archive_id: string, notion: string}, undefined, {contenst: {page: any}}, undefined> | null>(null)
    const [page, setPage] = useState<any | null>([])
    
    useEffect(() => {
        (async () => {
            WsRef.current = new WebSocket_CALL<{archive_id: string, notion: string}, undefined, {contenst: {page: any}}, undefined>(
                "ws://localhost:8010/ws/v1/archive/textbook",
                
                // Start
                () => {},

                // Stream
                async (data: {contenst: {page: any}}) => {
                    console.log(data)
                    setPage(data.contents.page)
                }, 
                
                // End
                () => {},

                // Error
                () => {}
            )
        })()
    }, [])

    useEffect(() => {
        if(!textbook) return; 

        switch(textbook.archive_status){
            case "PENDING":
                WsRef.current?.send({
                    archive_id: textbook.id,
                    notion: textbook.contents.notion
                })

                break;
            
            case "RUNNING":

                break;

            case "SUCCEEDED":

                break;

            case "CANCELLED":

                break;

            case "FAILED":

                break
        }

        setPage(textbook.contents.page)
    }, [textbook])

    return(
        <>
            {/* <PageTitle number={1} title={textbook?.contents.notion} className="h-1/12"/> */}
            <div className="h-full overflow-y-scroll">
                {page.map((element, idx: number) => (
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
            </div>
        </>
    )
}