import { GridContainer } from "../molecules/Container"
import { NavIcon } from "../atoms/Button"
import { NavType } from "@/types/ui/atoms/Button"

import { faFireFlameSimple, faMagnifyingGlass, faHouse, faMap, faUser } from "@fortawesome/free-solid-svg-icons";

type NavBarProps = {
    children: React.ReactNode;
} & (
    | { actives: Record<NavType, boolean> }
    | { match: boolean; explore: boolean; home: boolean; map: boolean; setting: boolean }
);

export const NavBar = (props: NavBarProps) => {
    const { children } = props;
    
    // Support both formats: individual props or actives object
    const actives = 'actives' in props 
        ? props.actives 
        : {
            match: props.match,
            explore: props.explore,
            home: props.home,
            map: props.map,
            setting: props.setting
        };

    return(
        <div className="w-full h-screen">
            <div className="h-[87%]">
                {children} 
            </div>
            <GridContainer minWidth={32} className="fixed bottom-2 w-full max-w-180 mx-auto px-5 py-2 border border-zinc-200 bg-white rounded-full">
                <NavIcon icon={faFireFlameSimple} label="マッチ" active={actives.match ?? false} />
                <NavIcon icon={faMagnifyingGlass} label="探検" active={actives.explore ?? false} />
                <NavIcon icon={faHouse} label="ホーム" active={actives.home ?? false} />
                <NavIcon icon={faMap} label="マップ" active={actives.map ?? false} />
                <NavIcon icon={faUser} label="設定" active={actives.setting ?? false} />
            </GridContainer>
        </div>
    )
}