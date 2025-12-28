"use client"
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BaseButton, IconButton } from "@/components/ui/atoms/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { BaseInputText } from "@/components/ui/atoms/Input";
import { BreadCrumb } from "@/components/ui/atoms/Text";
import { GroupForm } from "@/features/mentor/Form";

const DreamerNewGroup = () => {

    return( 
        <SideBar>
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
          
            <h1>Dreamerグループ 作成</h1>
          
            <VerticalStackContainer space={8} className="my-6">
                <GroupForm/>

                <HorizontalStackContainer space={8} className="mx-auto">
                    <BaseButton color="white" className="rounded-full! px-8">
                        キャンセル
                    </BaseButton>
                    <BaseButton color="blue" className="!rounded-full px-8">
                        グループ作成
                    </BaseButton    >
                </HorizontalStackContainer>
            </VerticalStackContainer>

        </SideBar>
   )
}

export default DreamerNewGroup