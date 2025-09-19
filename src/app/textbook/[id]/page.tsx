"use client"

import { ArchiveTableType, ArchiveType } from "@/types/table/archive"

import { HorizontalStackContainer } from "@/components/ui/molecules/Container"
import { TextBookPlanCard } from "@/components/ui/molecules/Card"
import { IoMdGitNetwork, IoIosArrowRoundForward  } from "react-icons/io";

import { SimpleModal } from "@/components/ui/molecules/Model";
import { ChatBox } from "@/components/ui/templates/ChatBox";
import { MediaPipe } from "@/components/ui/templates/MediaPipe";
import { TextBook } from "@/components/ui/templates/TextBook";
import { IconButton } from "@/components/ui/atoms/Button";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CALL } from "@/lib/api-client/api-call";


const TextBookPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const [textbooks, setTextbooks] = useState<ArchiveTableType[]>([])
    const [currentTextbook, setCurrentTextbook] = useState<ArchiveTableType | null>(null);

    const [planModalToggle, setplanModalToggle] = useState(false)

    const query_id = params.id as string ?? null;
    const archive_id = searchParams.get("archive_id") ?? null

    useEffect(() => {
        // 教科書データ（学習プラン）の取得
        (async () => {
            if(!query_id) //query_idがない場合の処理 

            console.log(query_id)

            await API_CALL<{query_id: string, archive_type: ArchiveType}, ArchiveTableType[]>(
                "GET",
                ":8010/api/v1/archive",
                {
                    params: {
                        query_id: query_id,
                        archive_type: "TEXTBOOK"
                    }
                },

                // Success
                async (data: ArchiveTableType[]) => {
                    console.log(data)
                    data.map((textbook) => {
                        if(textbook.id == archive_id) setCurrentTextbook(textbook)
                    })
                    setTextbooks(data)
                },

                // Error
                async (code: string, message: string) => {

                }
            )
        })()
    }, [])

    return(
        <>
            {/* <SimpleModal className="w-1/2" title="学習プラン" isOpen={planModalToggle} setIsOpen={(flag: boolean) => setplanModalToggle(flag)}>
                <HorizontalStackContainer space={2}>
                    {textbooks.map((textbook: ArchiveTableType, index) => (
                        <>
                            <TextBookPlanCard archive_id={textbook.id} index={index} key={index} current={archive_id == textbook.id}/>
                            {index + 1 < textbooks.length && (
                                <div className="flex justify-center items-center">
                                    <IoIosArrowRoundForward size={"90%"}/>
                                </div>
                            )}
                        </>
                    ))}
                </HorizontalStackContainer>
            </SimpleModal> */}

            <HorizontalStackContainer space={8} className="m-2 overflow-y-hidden">
                <div className="w-1/4 h-screen">
                    <div className="h-1/3 relative my-1">
                        <MediaPipe/>
                    </div>
                    <div className="h-2/3">
                        <ChatBox query_id={query_id}/>
                    </div>
                </div>
                <div className="w-3/4 h-screen">
                    <TextBook textbook={currentTextbook}/>
                    <div className="flex justify-end">
                        <IconButton icon={<IoMdGitNetwork size={"90%"}/>} className="!rounded-full" color="transparent" onClick={() => setplanModalToggle(true)}/>
                    </div>
                </div>
            </HorizontalStackContainer>
        </>
    )
}

export default TextBookPage