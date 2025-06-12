import { CenterContainer } from "@/components/ui/molecules/Container"
import { AuthSend } from "@/components/ui/templates/Auth"

const Send = () => {
    return(
        <CenterContainer className="h-screen">
            <AuthSend className="text-center" email="example@domain.com" type="signup"/>
        </CenterContainer>
    )
}

export default Send