"use client"

import { useState } from "react";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container";
import { BaseButton, IconButton } from "@/components/ui/atoms/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { DreamerForm } from "@/features/mentor/Form";
import { BreadCrumb } from "@/components/ui/atoms/Text";

const NewDreamer = () => {
    const [mode, setMode] = useState<'single' | 'bulk'>('single');

    return (
        <SideBar>
            <VerticalStackContainer space={8} className="h-full">
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

                <h1>Dreamerアカウント 作成</h1>

                {mode === 'single' ? (
                    <DreamerForm/>
                ) : (
                    <></>
                )}

                <HorizontalStackContainer space={8} className="mx-auto">
                    <BaseButton color="white" className="rounded-full! px-8">
                        キャンセル
                    </BaseButton>
                    <BaseButton  color="blue" className="!rounded-full px-8">
                        アカウントを追加
                    </BaseButton>
                </HorizontalStackContainer>
            </VerticalStackContainer>
        </SideBar>
    )
}

export default NewDreamer;