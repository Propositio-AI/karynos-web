"use client"

import { CenterContainer, HorizontalStackContainer, VerticalStackContainer } from "@/components/ui/molecules/Container"
import { BaseInputText } from "@/components/ui/atoms/Input"
import { BaseButton, IconButton } from "@/components/ui/atoms/Button"
import '@/lib/auth/amplify';
import { AnimatePresence } from "framer-motion"

import { FadeInAnimation } from "@/components/ui/molecules/Animation"
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import LogoutButton from "@/components/features/user/LogoutButton"

type Props = {
    step: string,
    email: string,
    isLoading: boolean,
    onChangeEmail: (v: string) => void,
    onChangeConfirmationCode: (v: string) => void,
    handleLogin: () => void,
    handleConfirmLogin: () => void,
    error: string,

};

const Login = ({
    step,
    email,
    isLoading,
    onChangeEmail,
    handleLogin,
    onChangeConfirmationCode,
    handleConfirmLogin,
    error,
}: Props) => {
    return( 
        <CenterContainer className="h-screen">
            <VerticalStackContainer className="w-96 shadow-2xl p-8 lg:p-12 border-emerald border-t-16">
                <h1 className="mb-12">Karynos</h1>
                {
                    step == "CONFIRM" ? (
                        <p className="mb-4">{email} に送信された認証コードを入力してください。</p>
                    ) : null
                }
                <AnimatePresence mode="wait">
                    <FadeInAnimation>
                        { step === "LOGIN" ? (
                            <VerticalStackContainer>
                                <label className="font-semibold">メールアドレス</label>
                                <HorizontalStackContainer space={4}>
                                    <BaseInputText className="w-full" placeholder="メールアドレスを入力してください" onChange={(e) => onChangeEmail(e.target.value)}/>
                                    <IconButton icon={faArrowRightLong} className="aspect-square !rounded-full" color="slate" isLoading={isLoading} onClick={() => handleLogin()}/>
                                </HorizontalStackContainer>
                            </VerticalStackContainer>
                        ): (
                            <VerticalStackContainer space={4}>
                                <VerticalStackContainer space={2}>
                                    <label className="font-semibold">認証コード</label>
                                    <BaseInputText className="w-full" placeholder="認証コードを入力してください" onChange={(e) => onChangeConfirmationCode(e.target.value)}/>
                                </VerticalStackContainer>
                                <BaseButton color="slate" className="w-1/2 mx-auto"  isLoading={isLoading} onClick={() => handleConfirmLogin()}>
                                    <h4>認証</h4>
                                </BaseButton>
                            </VerticalStackContainer>
                        )}

                        <LogoutButton/>
                        {/* {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )} */}
                    </FadeInAnimation>
                </AnimatePresence>
            </VerticalStackContainer>
        </CenterContainer>
   )
}

export default Login;