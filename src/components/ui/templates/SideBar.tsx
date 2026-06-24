import { HorizontalStackContainer, VerticalStackContainer } from "../molecules/Container"
import { SideBarButton } from "../atoms/Button"

import { faDashboard, faUser, faUsers, faGear, faQuestion, faBook, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const SideBar = ({children}: {children: React.ReactNode}) => {
    return(
        <HorizontalStackContainer>
            <VerticalStackContainer space={8} className="h-screen w-80 border-r border-line bg-surface p-6">
                <div>
                    <h2 className="font-bold text-ink">Karynos</h2>
                </div>

                <VerticalStackContainer space={2}>
                    <p className="font-semibold text-subtle text-xs uppercase tracking-wide">メインメニュー</p>
                    <SideBarButton icon={faDashboard} active={true}>ダッシュボード</SideBarButton>
                    <SideBarButton icon={faUser} active={false}>Dreamer管理</SideBarButton>
                    <SideBarButton icon={faUsers} active={false}>グループ管理</SideBarButton>
                </VerticalStackContainer>
                <VerticalStackContainer space={2}>
                    <p className="font-semibold text-subtle text-xs uppercase tracking-wide">管理機能</p>
                    <SideBarButton icon={faGear} active={false}>設定</SideBarButton>
                </VerticalStackContainer>
                <VerticalStackContainer space={2}>
                    <p className="font-semibold text-subtle text-xs uppercase tracking-wide">サポート</p>
                    <SideBarButton icon={faQuestion} active={false}>ヘルプ</SideBarButton>
                    <SideBarButton icon={faBook} active={false}>マニュアル</SideBarButton>
                    <SideBarButton icon={faEnvelope} active={false}>お問い合わせ</SideBarButton>
                </VerticalStackContainer>
            </VerticalStackContainer>

            <div className="w-full h-screen bg-canvas p-8 overflow-y-scroll border-l border-line">
                {children}
            </div>
        </HorizontalStackContainer>
    )
}