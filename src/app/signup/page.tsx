import { CenterContainer } from "@/components/ui/molecules/Container"
import { AuthForm } from "@/components/ui/templates/Auth"

const Signup = () => {
    return(
        <CenterContainer className="w-full h-screen">
            <AuthForm type="signup"/>
        </CenterContainer>
   )
}

export default Signup