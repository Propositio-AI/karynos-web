import { HorizontalStackContainer } from "../molecules/Container"
import { NavIcon } from "../atoms/Button"
import { NavType } from "@/types/ui/atoms/Button"

export const NavBar = (actives: Record<NavType, boolean>) => {
    return(
        <HorizontalStackContainer className="px-8 py-2 border border-zinc-200 rounded-full">
            <NavIcon type="match" active={actives.match} />
            <NavIcon type="explore" active={actives.explore} />
            <NavIcon type="home" active={actives.home} />
            <NavIcon type="map" active={actives.map} />
            <NavIcon type="setting" active={actives.setting} />
        </HorizontalStackContainer>
    )
}