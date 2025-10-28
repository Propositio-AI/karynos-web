"use client"

import { CenterContainer, VerticalStackContainer } from "@/components/ui/molecules/Container"

import { BaseInputText } from "@/components/ui/atoms/Input"
import { BaseButton } from "@/components/ui/atoms/Button"

const MentorLogin = () => {

    return( 
        <CenterContainer className="h-screen">
            <VerticalStackContainer space={8} className="w-full m-4 lg:w-1/2 max-w-100 shadow-2xl p-8 lg:p-12 border-blue-500 border-t-16">
                <span className="text-center">
                    <h1 className="my-2">Karynos</h1>
                    <h4 className="text-zinc-500">Mentorアカウントにログイン</h4>
                </span>
                
                <VerticalStackContainer space={4}>
                    <VerticalStackContainer space={2}>
                        <label className="font-semibold">Mentor ID</label>
                        <BaseInputText className="w-full" placeholder="Mentor IDを入力してください" />
                        <label>パスワード</label>
                        <BaseInputText placeholder="パスワードを入力してください" />
                    </VerticalStackContainer>
                </VerticalStackContainer>
                <VerticalStackContainer space={4}>
                    <BaseButton color="slate">
                        <h4>ログイン</h4>
                    </BaseButton>

                    <a href="" className="text-zinc-500 hover:underline text-center">パスワードを忘れた方</a>
                </VerticalStackContainer>
            </VerticalStackContainer>
        </CenterContainer>
   )
}

export default MentorLogin