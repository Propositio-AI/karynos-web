import { CenterContainer } from "@/components/ui/molecules/Container"
import { AuthSend } from "@/components/ui/templates/Auth"

const Send = () => {
    return(
        <CenterContainer className="h-scren">
            <AuthSend className="text-center" email="example@domain.com" type="login"/>
        </CenterContainer>
    )
}

export default Send