import { BaseInputTextType } from "@/types/ui/Atoms"

export const BaseInputText = (props: BaseInputTextType) => {
    return(
        <>
            <input type="text" className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 ${props.className}`} value={props.value} placeholder={props.placeholder}/>
        </>
    )
}

export const SearchInputText = (props: BaseInputTextType) => {
    return(
        <input type="text" className={`block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${props.className}`} placeholder={props.placeholder} value={props.value} />
    )
}