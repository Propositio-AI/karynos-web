"use client"

import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { IconButton } from "@/components/ui/atoms/Button";
import { BreadCrumb, Tag } from "@/components/ui/atoms/Text";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ProfileText } from "@/components/features/mentor/Text";

const DreamerDetail = () => {

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                <BreadCrumb
                    links={[
                        {
                            name: "Dreamer管理",
                            link: ""
                        },
                        {
                            name: "新規作成",
                            link: ""
                        }
                    ]}
                />

                <VerticalStackContainer className="flex-1 bg-surface border border-line rounded-(--radius-md)" space={4}>
                        <HorizontalStackContainer className="w-full p-8">
                            <img alt="User Icon" src="https://www.figma.com/api/mcp/asset/6ee632ba-ade1-40f4-ae60-7d8c9991cbd1" className="w-14 h-14" />
                            <div className="w-full">
                                <h3>山田太郎</h3>
                                <HorizontalStackContainer space={2} className="mt-2">
                                    <Tag text="3年" color="green"/>
                                    <Tag text="3年A組" color="blue"/>
                                </HorizontalStackContainer>
                            </div>
                            <IconButton icon={faEdit} className="w-30">
                                編集
                            </IconButton>
                        </HorizontalStackContainer>

                        <table className="w-full m-8 table-fixed">
                            <tbody>
                                <tr>
                                    <td className="p-3">
                                        <ProfileText title="学籍番号" text="ST001"/>
                                    </td>
                                    <td className="p-3">
                                        <ProfileText title="最終ログイン日 " text="2024年1月15日 14:30"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-3">
                                        <ProfileText title="入学年度" text="2023年度"/>
                                    </td>
                                    <td className="p-3">
                                        <ProfileText title="総使用時間" text="48時間30分"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-3">
                                        <ProfileText title="アカウント作成日" text="2023年4月1日"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                </VerticalStackContainer>

            </VerticalStackContainer>
        </SideBar>
    )
}

export default DreamerDetail