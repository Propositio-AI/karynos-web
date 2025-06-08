import { IoMdHome, IoMdSearch, IoMdBook } from "react-icons/io";
import { VerticalStackContainer } from "../molecules/Container";
import { SideBarFooter } from "../molecules/SideBarFooter";
import { IconButton } from "../atoms/Button"

export const SideBar = () => {
    return(
        <div className="h-[100vh] bg-gray-200 w-1/3 p-2">
            <h1>Karynos</h1>
            <VerticalStackContainer space="1">
                <IconButton className="w-full" color="transparent" icon={<IoMdHome size={"100%"}/>}>
                    <h4>ホーム</h4>
                </IconButton>
                <IconButton className="w-full" color="transparent" icon={<IoMdSearch size={"100%"}/>}>
                    <h4>アーカイブ</h4>
                </IconButton>
                <IconButton className="w-full" color="transparent" icon={<IoMdBook size={"100%"}/>}>
                    <h4>ダッシュボード</h4>
                </IconButton>
            </VerticalStackContainer>
            <SideBarFooter/>
        </div>
    )
}