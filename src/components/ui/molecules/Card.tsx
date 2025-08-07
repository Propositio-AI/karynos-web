import { DashboardCardType, TextBookCardType } from "@/types/ui/Molecules"
import { HorizontalStackContainer, VerticalStackContainer } from "./Container"
import { FavoriteButton } from "@/components/ui/atoms/Button";
import { BaseColumnCardType } from "@/types/ui/Molecules";
import { FaBook, FaMedal, FaFile, FaNewspaper, FaPen} from "react-icons/fa";


export const DashboardCard  = (props: DashboardCardType) =>{
    return(
        <VerticalStackContainer space="2" className="p-8 w-ful shadow-xl rounded-xl">
            <p className="text-gray-500">{props.title}</p>
            <HorizontalStackContainer space="2">
                <span className="h-6 aspect-square flex justify-center items-center">
                    {props.icon}
                </span>
                <h2>{props.value}</h2>
            </HorizontalStackContainer>
            <p className="text-green-400">{props.timeChange}</p>
        </VerticalStackContainer>
    )
} 

export const TextBookCard = (props: TextBookCardType) => {
    return(
        <VerticalStackContainer space="2" className={`p-8 w-ful shadow-xl rounded-xl cursor-pointer ${props.className}`}>
            <HorizontalStackContainer className="items-start" space="1">
                <h3 className="w-full">{props.title}</h3>
                <FavoriteButton className="mt-1"/>
            </HorizontalStackContainer>
            <small className="text-gray-400">{props.date}</small>
            <p className="text-gray-500">{props.description}</p>
        </VerticalStackContainer>
    )
}

export const BaseColumnCard = (props: BaseColumnCardType) => {
    const typeMap: Record<string, string> = {
        "definition": "定義", 
        "theorem": "定理", 
        "example": "例題",
        "column": "コラム", 
        "furmula": "公式"
    }

    const styleMap: Record<string, Record<string, string | React.ReactNode>> = {
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
        <VerticalStackContainer space="4" className={`my-2 p-4 bg-gray-50 shadow-md rounded  ${props.className} ${styleMap[props.type].root}`}>

            <HorizontalStackContainer space="2" className={`${styleMap[props.type].text}`}>
                {styleMap[props.type].icon}
                <h3>
                    {typeMap[props.type]} : {props.title}
                </h3>
            </HorizontalStackContainer>
            {props.children}
        </VerticalStackContainer>
    )
}