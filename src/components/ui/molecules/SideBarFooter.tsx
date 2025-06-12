import { IoPersonSharp } from "react-icons/io5";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { IconButton } from "../atoms/Button"
import { HorizontalStackContainer } from "./Container";
import { SideBarFooterType } from "@/types/ui/Templates";

export const SideBarFooter = (props: SideBarFooterType) => {
    return(
        <HorizontalStackContainer space="2" className={props.className}>
            <IconButton className="w-full" color="transparent" icon={<IoPersonSharp size={"100%"}/>}>
                <span className="text-start">
                    <h4>小林 蓮</h4>
                    <small>近畿大学附属高校</small>
                </span>
            </IconButton>
            <IconButton color="transparent" icon={<FaArrowRightFromBracket size={"75%"}/>}/>
        </HorizontalStackContainer>
    )
}