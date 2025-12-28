import { BaseInputTextType } from "@/types/ui/atoms/Input"

/**

BaseInputText コンポーネント

共通のテキスト入力コンポーネント

props:
- value: 入力値
- placeholder: プレースホルダー
- className: 追加のCSSクラス
- onChange: 入力値変更時のコールバック関数

**/
export const BaseInputText = ({type, value, placeholder, className = "", onChange}: BaseInputTextType) => {
    return(
        <input
            type={type}
            className={`bg-zinc-50 border border-zinc-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 ${className}`}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
    )
}

/**

SearchInputText コンポーネント

検索用テキスト入力コンポーネント        

props:
- value: 入力値
- placeholder: プレースホルダー
- className: 追加のCSSクラス
- onChange: 入力値変更時のコールバック関数

**/
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