import { GridContainer } from "../molecules/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { TagColor } from "@/types/ui/atoms/Text";

import { faUser } from "@fortawesome/free-solid-svg-icons";


export const Tag = ({text, color}: {text: string, color: TagColor}) => {
    const ColorMap: Record<TagColor, {bg: string, hover: string, text: string}> = {
        slate: {bg: "bg-slate-100", hover: "bg-slate-200", text: "text-slate-800"},
        red: {bg: "bg-red-100", hover: "bg-red-200", text: "text-red-800"},
        orange: {bg: "bg-orange-100", hover: "bg-orange-200", text: "text-orange-800"},
        yellow: {bg: "bg-yellow-100", hover: "bg-yellow-200", text: "text-yellow-800"},
        green: {bg: "bg-green-100", hover: "bg-green-200", text: "text-green-800"},
        blue: {bg: "bg-blue-100", hover: "bg-blue-200", text: "text-blue-800"},
        purple: {bg: "bg-purple-100", hover: "bg-purple-200", text: "text-purple-800"},
    }

    return (
        <div className={`inline-flex m-1 px-2.5 py-1 rounded-full border ${ColorMap[color].bg} hover:${ColorMap[color].hover} ${ColorMap[color].text} cursor-pointer `}>
            <span className="text-xs font-medium">{text}</span>
        </div>
    );
}

export const ChatMessage = ({message, isUser}: {message: string, isUser: boolean}) => {
    return (
        <div className="w-full">
            {isUser ? (
                 <div className="bg-emerald-500 max-w-2/3 p-3 rounded-lg my-2 text-white ml-auto">
                    <p>{message}</p>
                </div>
            ) :  (  
                <div className="bg-white max-w-2/3 p-3 rounded-lg my-2 text-slate-900 mr-auto">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}

export const DreamerListItem = ({name, student_num, group, login_at, created_at}: {name: string, student_num: string, group: {label: string, id: string}[], login_at: string, created_at: string}) => {
    return (
        <tr className="bg-white hover:bg-zinc-100 cursor-pointer">
            <td className="p-4">
                <FontAwesomeIcon icon={faUser} className="h-10 aspect-square mr-2 flex justify-center items-center"/>
                {name}
            </td>
            <td className="p-2">{student_num}</td>
            <td className="p-2">
                <GridContainer minWidth={30}>
                    {group.map((g) => (
                        <Tag key={g.id} color="blue" text={g.label}/>
                    ))}
                </GridContainer>
            </td>
            <td className="p-2">
                {login_at}
            </td>
            <td className="p-2">
                {created_at}
            </td>
        </tr>
    )
}