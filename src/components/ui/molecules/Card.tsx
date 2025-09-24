import { HorizontalStackContainer, VerticalStackContainer } from "./Container"
import { FavoriteButton } from "@/components/ui/atoms/Button";
import { FaBook, FaMedal, FaFile, FaNewspaper, FaPen} from "react-icons/fa";
import renderTextBook from "@/lib/textbook-compiler";
import { useEffect, useState } from "react";
import { ArchiveTableType } from "@/types/table/archive";
import { QueryTableType } from "@/types/table/query";
import { API_CALL } from "@/lib/api-client/api-call";

// Dashboard Card
type DashboardCardType = {
    title: string
    icon?: React.ReactNode 
    value: string
    timeChange?: string
}
export const DashboardCard  = ({title, icon, value, timeChange}: DashboardCardType) =>{
    return(
        <VerticalStackContainer space={2} className="p-8 w-ful shadow-xl rounded-xl">
            <p className="text-gray-500">{title}</p>
            <HorizontalStackContainer space={2}>
                <span className="h-6 aspect-square flex justify-center items-center">
                    {icon}
                </span>
                <h2>{value}</h2>
            </HorizontalStackContainer>
            <p className="text-green-400">{timeChange}</p>
        </VerticalStackContainer>
    )
} 

// TextBook Card
type TextBookCardType = {
    className?: string
    title: string
    date: string
    description: string
    percent: number
    favorite: boolean
}
export const TextBookCard = ({className = "", title, date, description, percent, favorite}: TextBookCardType) => {
    return(
        <VerticalStackContainer space={2} className={`p-8 w-ful shadow-xl rounded-xl cursor-pointer ${className}`}>
            <HorizontalStackContainer className="items-start" space={1}>
                <h3 className="w-full">{title}</h3>
                <FavoriteButton className="mt-1"/>
            </HorizontalStackContainer>
            <small className="text-gray-400">{date}</small>
            <p className="text-gray-500">{description}</p>
        </VerticalStackContainer>
    )
}

// Base Column Card
type ColumnKey = "definition" | "theorem" | "example" | "column" | "formula"
type BaseColumnCardType = {
    type: ColumnKey
    title?: string
    children?: React.ReactNode
    className?: string
}
export const BaseColumnCard = ({type, title,  children, className}: BaseColumnCardType) => {
    const typeMap: Record<ColumnKey, string> = {
        "definition": "定義", 
        "theorem": "定理", 
        "example": "例題",
        "column": "コラム", 
        "formula": "公式"
    }

    const styleMap: Record<ColumnKey, Record<string, string | React.ReactNode>> = {
       "definition": {
            "root": "border-l-8 border-green-400",
            "text": "text-green-400",
            "icon": <FaBook />
       }, 
        "theorem": {
            "root": "border-l-8 border-blue-400",
            "text": "text-blue-400",
            "icon": <FaMedal />
       }, 
        "example": {
            "root": "border-l-8 border-blue-800",
            "text": "text-blue-800",
            "icon": <FaFile />

       },
        "column": {
            "root": "border-4 border-green-800",
            "text": "text-green-800",
            "icon": <FaNewspaper />
       },
        "formula": {
            "root": "border-4 border-pink-300",
            "text": "text-pink-300",
            "icon": <FaPen />
       },
    }
    return(
        <VerticalStackContainer space={4} className={`my-2 p-4 bg-gray-50 shadow-md rounded  ${className} ${styleMap[type].root}`}>

            <HorizontalStackContainer space={2} className={`${styleMap[type].text}`}>
                {styleMap[type].icon}
                <h3>
                    {typeMap[type]} : {title}
                </h3>
            </HorizontalStackContainer>
            {children}
        </VerticalStackContainer>
    )
}

// Chat Message
export const ChatMessageCard = ({ query, archive }: {query: QueryTableType, archive: ArchiveTableType | null}) => {
    const [userMessage, setUserMessage] = useState("")
    const [aiMessage, setAiMessage] = useState("")

    useEffect(() => {
        setUserMessage(query?.query)
        
        // Archiveがnullの場合
        if(archive == null){
            // archiveを取得
            (async () => {
                await API_CALL<{query_id: string, archive_type: string}, ArchiveTableType[]>(
                    "GET",
                    ":8010/api/v1/archive",
                    {
                        params: {
                            "query_id": query.id,
                            "archive_type": "CHAT"
                        }
                    },

                    // Success
                    async (data: ArchiveTableType[]) => {
                        setAiMessage(data[0]?.contents.message ?? "")
                    },

                    // Error
                    async (code: string, message: string) => {

                    }
                )
            })();    
        }else{
            setAiMessage(archive.contents.message)
        }
    }, [archive])

    return (
        <>
            <div className="flex justify-end my-4">
                <p className="py-2 px-4 text-sm bg-gray-100 rounded-full">
                    {userMessage}
                </p>
            </div>
            <div className="flex justify-start my-4">
                <div>
                    {renderTextBook(aiMessage)}
                </div>
            </div>
        </>
    )
}

// TextBook Plan Card
type TextBookPlanCardType = {
    archive_id: string,
    index: number
    current: boolean
}
export const TextBookPlanCard = ({archive_id, index, current}: TextBookPlanCardType) => {
    const [notion, setNotion] = useState<string | null>(null)
    
    let bg: string = "bg-gray-100"
    if(current) bg = "bg-gray-300"

    useEffect(() => {
        (async () => {
            await API_CALL<undefined, ArchiveTableType>(
                "GET",
                `:8010/api/v1/archive/${archive_id}`,
                undefined,

                // Success
                async (data: ArchiveTableType) => {
                    setNotion(data.contents.notion)
                },

                // Error 
                async (code: string, message: string) => {

                }
            )
        })()
    }, []);
    
    return(
        <div className="shadow-lg p-2 text-center cursor-pointer">
            <div className={`flex mx-auto my-6 rounded-full w-8 h-8 items-center justify-center ${bg}`}>
                <p className="text-lg font-bold p-2">{index}</p>
            </div>
            <h4>{notion}</h4>
        </div>
    )
}