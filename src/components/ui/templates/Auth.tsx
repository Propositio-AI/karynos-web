import { BaseButton } from "@/components/ui/atoms/Button"
import { BaseInputText } from "@/components/ui/atoms/Input"
import { VerticalStackContainer } from "@/components/ui/molecules/Container"
import { AuthFormType } from "@/types/ui/Templates"
import { AuthSendType } from "@/types/ui/Templates"

import Link from "next/link"

const default_type = "login"

export const AuthForm = (props: AuthFormType) => {
    const titleMap: Record<string, string> = {
        "login": "ログイン",
        "signup": "アカウントを作成"
    }
    const buttonTextMap: Record<string, string> = {
        "login": "ログイン",
        "signup": "サインインアップ"
    }
    const reverseTitleMap: Record<string, string> = {
        "login": "アカウントを作成",
        "signup": "ログインする"
    }
    const reverseMessageMap: Record<string, string> = {
        "login": "まだアカウントをお持ちでないですか？",
        "signup": "すでにアカウントをお持ちですか？"
    }

    const title = titleMap[props.type] ?? titleMap[default_type]
    const buttonText = buttonTextMap[props.type] ?? buttonTextMap[default_type] 
    const reverseMessage = reverseMessageMap[props.type] ?? reverseMessageMap[default_type]
    const reverseTitle = reverseTitleMap[props.type] ?? reverseTitleMap[default_type]

    return(
        <VerticalStackContainer space="4" className="text-center w-1/4">
            <div>
                <h2>{title}</h2>
                <p>メールアドレスを入力してください</p>
            </div>
            <BaseInputText className="w-full" placeholder="メールアドレス"/>
            <BaseButton color="black" className="w-full">{buttonText}</BaseButton>
            <hr className="bg-gray-200"/>
            <div>
                <p>{reverseMessage}</p>
                <Link href="" className="underline">
                    <p>{reverseTitle}</p>
                </Link>
            </div>
        </VerticalStackContainer>
   )
}

export const AuthSend = (props: AuthSendType) => {
    const titleMap: Record<string, string> = {
        "login": "ログイン",
        "signup": "アカウントを作成"
    }
    const messageMap: Record<string, string> = {
        "login": "にログイン用リンクを送信しました。",
        "signup": "に会員登録用リンクを送信しました。"
    }

    const message = messageMap[props.type] ?? messageMap[default_type]
    const title = titleMap[props.type] ?? titleMap[default_type]

    return(
        <VerticalStackContainer space="2" className={props.className}>
            <h2>{title}</h2>
            <h4>{props.email}に{message}</h4>
            <BaseButton color="white">再送信</BaseButton>
        </VerticalStackContainer>
    )
}
