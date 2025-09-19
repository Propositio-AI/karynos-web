"use client"
import { useState } from "react"

import { BaseButton } from "@/components/ui/atoms/Button"
import { BaseInputText } from "@/components/ui/atoms/Input"
// import { sendMail } from "@/lib/api-client/auth"
import { VerticalStackContainer, CenterContainer } from "@/components/ui/molecules/Container"

const Login = () => {
    const [email, setEmail] = useState<string>("")
    const [message, setMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // TOOD: 再実装
    const sendMailBtn = async () => {   
        // setIsLoading((prev) => !prev)

        // const {status, data} = await sendMail({"email": email})

        // if(status == 200){
        //     setMessage(`${email}に認証リンクを送信しました。`)
        //     setIsLoading((prev) => !prev)   
        // }
    }

    return( 
        <CenterContainer className="w-full h-screen">    
            <VerticalStackContainer space={4} className="text-center lg:w-1/4">
                <div>
                    <h2>ログイン</h2>
                    <p>メールアドレスを入力してください</p>
                </div>
                <BaseInputText className="w-full" placeholder="メールアドレス" onChange={(e) => setEmail(e.target.value)}/>
                <BaseButton color="black" className="w-full" onClick={sendMailBtn} isLoading={isLoading}>リンクを送信する</BaseButton>
                <p>{message}</p>
            </VerticalStackContainer>
        </CenterContainer>
   )
}

export default Login