"use client"

import { HorizontalStackContainer } from "@/components/ui/molecules/Container"
import { ChatContainer } from "@/components/features/chat/Text"
import { BaseInputText } from "@/components/ui/atoms/Input"
import { IconButton } from "@/components/ui/atoms/Button"

import { faPaperPlane, faArrowLeft } from "@fortawesome/free-solid-svg-icons"

const WorkerChat = () => {
    return( 
        <div className="h-screen">
            <HorizontalStackContainer className="h-1/12 px-2">
                <IconButton icon={faArrowLeft} className="!rounded-full !border-none"/>
                <h3>消防士</h3>
            </HorizontalStackContainer>

            <ChatContainer className="h-10/12"/>

            <HorizontalStackContainer space={4} className="mx-6 h-1/12">
                <BaseInputText className="w-full !rounded-full" placeholder="テキストを入力"/>
                <IconButton color="emerald" icon={faPaperPlane} className="!rounded-full !aspect-square"/>
            </HorizontalStackContainer>
        </div>
   )
}

export default WorkerChat