"use client"

/*背景が謎にずれます*/

import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BaseButton, IconButton } from "@/components/ui/atoms/Button";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { BreadCrumb } from "@/components/ui/atoms/Text";
import { DreamerForm } from "@/features/mentor/Form";

const DreamerEdit = () => {

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

                <h1>Dreamerアカウントを編集</h1>
                
                <DreamerForm/>

                <HorizontalStackContainer space={8} className="mx-auto">
                    <BaseButton color="white" className="rounded-full! px-8">
                        キャンセル
                    </BaseButton>
                    <IconButton icon={faSave} color="blue" className="!rounded-full">
                        保存
                    </IconButton>
                </HorizontalStackContainer>
            </VerticalStackContainer>
        </SideBar>
    )
}

export default DreamerEdit;
