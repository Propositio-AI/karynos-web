import { BaseButton } from "@/components/ui/atoms/Button"
import { BaseInputText } from "@/components/ui/atoms/Input"
import { CenterContainer } from "@/components/ui/molecules/Container"
import { AuthForm } from "@/components/ui/templates/Auth"
import Link from "next/link"

const Login = () => {
    return(
        <CenterContainer className="w-full h-screen">
            <AuthForm type="login"/>
        </CenterContainer>
   )
}

export default Login