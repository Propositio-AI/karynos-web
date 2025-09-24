"use client"

import { ArchiveTableType, ArchiveType } from "@/types/table/archive"
import { PageTitle } from "@/components/ui/atoms/Text";
import { HorizontalStackContainer, VerticalStackContainer } from "@/components/ui/molecules/Container"

import { SimpleModal } from "@/components/ui/molecules/Model";
import { ChatBox } from "@/components/ui/templates/ChatBox";
import { MediaPipe } from "@/components/ui/templates/MediaPipe";
import { TextBook } from "@/components/ui/templates/TextBook";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CALL } from "@/lib/api-client/api-call";

import { IoMdGitNetwork } from "react-icons/io";
import { IconButton } from "@/components/ui/atoms/Button";
import { GeneratingPing } from "@/components/ui/molecules/Animation";
const TextBookPage = () => {
    const router = useRouter()
    const params = useParams();
    const searchParams = useSearchParams();

    const [textbooks, setTextbooks] = useState<Record<string, ArchiveTableType>>({})
    const [currentTextbook, setCurrentTextbook] = useState<ArchiveTableType | null>(null);
    const [isRunning, setIsRunning] = useState(false)

    const [planModalToggle, setplanModalToggle] = useState(false)

    const query_id = params.id as string ?? null;
    const archive_id = searchParams.get("archive_id") ?? null

    const selectArchive =  (id: string) => {
        console.log(textbooks[id])
        if(textbooks[id]) setCurrentTextbook(textbooks[id])
        setplanModalToggle(false)

        const params = new URLSearchParams(searchParams.toString())

        params.set("archive_id", id)
        router.push(`${window.location.pathname}?${params.toString()}`);
    }

    useEffect(() => {
        // 教科書データ（学習プラン）の取得
        (async () => {
            // TEXTBOOKを取得
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
                        setTextbooks(prev => {
                            const updated = { ...prev };
                            data.forEach((t: ArchiveTableType) => {
                                updated[t.id] = t; 

                                if(t.id == archive_id) setCurrentTextbook(t)
                            });
                            return updated;
                        });
                },

                // Error
                async (code: string, message: string) => {

                }
            )
        })()

        if(!archive_id) setplanModalToggle(true)
    }, [])

    useEffect(() => {
        setIsRunning(false)
        if(currentTextbook?.archive_status == "RUNNING") setIsRunning(true)
    }, [currentTextbook])

    return(
        <div className="overflow-y-hidden h-screen">
            <SimpleModal className="w-1/2" title="学習プラン" isOpen={planModalToggle} setIsOpen={(flag: boolean) => setplanModalToggle(flag)} >
                <VerticalStackContainer space={2}>
                    {Object.values(textbooks).map((textbook: ArchiveTableType, index) => (
                        <HorizontalStackContainer
                            key={textbook.id}
                            className="my-5 cursor-pointer"
                            onClick={() => selectArchive(textbook.id)}
                        >
                            <div className="w-8 h-8 bg-gray-200 rounded-full text-center">
                                <p className="text-lg font-semibold">{index}</p>
                            </div>
                            <h4 className="hover:underline">{textbook.contents.notion}</h4>
                        </HorizontalStackContainer>
                    ))}
                </VerticalStackContainer>
            </SimpleModal>

            <HorizontalStackContainer space={8} className="m-2 overflow-y-hidden">
                <div className="w-1/4 h-screen">
                    <div className="h-1/3 relative">
                        <MediaPipe/>
                    </div>
                    <div className="h-2/3">
                        <ChatBox query_id={query_id}/>
                    </div>
                </div>
                <div className="w-3/4 h-screen">
                    <HorizontalStackContainer className="h-[5%]">
                        <HorizontalStackContainer className="w-1/2" space={8}>
                            <PageTitle number={1} title={currentTextbook?.contents.notion}/>
                        </HorizontalStackContainer>
                        <HorizontalStackContainer className="w-1/2 justify-end" space={8}>
                            <HorizontalStackContainer className={`${isRunning ? "block": "hidden"}`}>
                                <p className="font-semibold">生成中</p>
                                <GeneratingPing/>
                            </HorizontalStackContainer>
                            <IconButton icon={<IoMdGitNetwork size={"90%"}/>} className="!rounded-full" color="transparent" onClick={() => setplanModalToggle(true)}/>
                        </HorizontalStackContainer>
                    </HorizontalStackContainer>
                    <TextBook textbook={currentTextbook}/>
                </div>
            </HorizontalStackContainer>
        </div>
    )
}

export default TextBookPage