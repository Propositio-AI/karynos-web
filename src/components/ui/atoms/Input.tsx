// BaseInputText

type BaseInputTextType = {
    value?: string
    placeholder?: string
    className?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const BaseInputText = ({value, placeholder, className, onChange}: BaseInputTextType) => {
    return(
        <input
            type="text"
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 ${className}`}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
    )
}


export const SearchInputText = ({value, placeholder, className = "", onChange}: BaseInputTextType) => {
    return(
        <input
            type="text"
            className={`block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    )
}