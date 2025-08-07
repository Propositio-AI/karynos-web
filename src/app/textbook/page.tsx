"use client"

import { useState } from "react";

import { sendQuery } from "@/lib/api-client/query";
import { CenterContainer } from "@/components/ui/molecules/Container"
import { BaseInputText } from "@/components/ui/atoms/Input"
import { HorizontalStackContainer } from "@/components/ui/molecules/Container"
import { IoIosSend } from "react-icons/io";
import { IconButton } from "@/components/ui/atoms/Button";


export const TextBook = () => {
    const [query, setQuery] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const senQueryBtn = async () => {
        setIsLoading((prev) => !prev)
        const {status, data} = await sendQuery({"query": query, "type": 0})

        setIsLoading((prev) => !prev)
        if(status == 200){
            console.log(data)
        }
    }

    return (
        <CenterContainer className="h-screen w-full">
            <div className="w-1/2">
                <h2 className="text-center">何を学びますか？</h2>
                <HorizontalStackContainer space="1">
                    <BaseInputText className="w-full my-8 rouded-full" placeholder="三角関数について教えて" onChange={(e) => setQuery(e.target.value)}/>

                    <IconButton color="white" className="!rounded-full hover:!bg-gray-100" icon={<IoIosSend size={"100%"}/>} onClick={senQueryBtn} isLoading={isLoading}/>
                </HorizontalStackContainer>
            </div>
        </CenterContainer>
    )
}

export default TextBook