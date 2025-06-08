import { BaseInputTextProps } from "@/types/ui/Atoms"

export const BaseInputText = (props: BaseInputTextProps) => {
    return(
        <>
            <input type="text" className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 ${props.className}`} value={props.value} placeholder={props.placeholder}/>
        </>
    )
}
