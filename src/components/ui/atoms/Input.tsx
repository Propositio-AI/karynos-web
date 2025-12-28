import { BaseInputTextType } from "@/types/ui/atoms/Input"
import { VerticalStackContainer } from "../molecules/Container"

/**

BaseInputText コンポーネント

共通のテキスト入力コンポーネント

props:
- value: 入力値
- placeholder: プレースホルダー
- className: 追加のCSSクラス
- onChange: 入力値変更時のコールバック関数

**/
export const BaseInputText = ({value, placeholder, className = "", label = "", type = "text", onChange}: BaseInputTextType) => {
    return(
        <VerticalStackContainer space={2} className="flex-1">
            { label != "" && (
                <label className="font-medium text-sm text-slate-800">{label}</label>
            )}
            <input
                type={type}
                className={`bg-white border border-zinc-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 ${className}`}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        </VerticalStackContainer>
    )
}

export const BaseTextArea = ({value, placeholder, className = "", label = "", type = "text", onChange}: BaseInputTextType) => {
    return(
        <VerticalStackContainer space={2} className="flex-1">
            { label != "" && (
                <label className="font-medium text-sm text-slate-800">{label}</label>
            )}
            <textarea
                className={`bg-white border border-zinc-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 ${className}`}
                value={value}
                placeholder={placeholder}
                // onInput={onChange}
            />
        </VerticalStackContainer>
    )
}