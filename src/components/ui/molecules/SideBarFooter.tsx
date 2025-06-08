import { IoPersonSharp } from "react-icons/io5";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { IconButton } from "../atoms/Button"
import { HorizontalStackContainer } from "./Container";

export const SideBarFooter = () => {
    return(
        <div>
            <HorizontalStackContainer space="2">
                <IconButton color="transparent" icon={<IoPersonSharp size={"100%"}/>}>
                    <span className="text-start">
                        <h4>小林 蓮</h4>
                        <p>近畿大学附属高校</p>
                    </span>
                </IconButton>
                <IconButton color="transparent" icon={<FaArrowRightFromBracket size={"75%"}/>}/>
            </HorizontalStackContainer>
        </div>
    )
}