"use client";

import {
  CenterContainer,
  VerticalStackContainer,
} from "@/components/ui/molecules/Container";

import { BaseInputText } from "@/components/ui/atoms/Input";
import { BaseButton } from "@/components/ui/atoms/Button";
import { NavBar } from "@/components/ui/templates/NavBar";

const DreamerLogin = () => {
  return (
    <NavBar
      match={false}
      explore={false}
      home={false}
      map={false}
      setting={false}
    >
      <CenterContainer className="h-screen">
        <VerticalStackContainer
          space={8}
          className="w-full m-4 lg:w-1/2 max-w-100 shadow-2xl p-8 lg:p-12 border-emerald-500 border-t-16"
        >
          <span className="text-center">
            <h1 className="my-2">Karynos</h1>
            <h4 className="text-zinc-500">Dreamerアカウントにログイン</h4>
          </span>

          <VerticalStackContainer space={4}>
            <VerticalStackContainer space={2}>
              <label className="font-semibold">Dreamer ID</label>
              <BaseInputText
                className="w-full"
                placeholder="Dreamer IDを入力してください"
              />
              <label className="font-semibold">パスワード</label>
              <BaseInputText placeholder="パスワードを入力してください" />
            </VerticalStackContainer>
          </VerticalStackContainer>
          <VerticalStackContainer space={4}>
            <BaseButton color="slate">
              <h4>ログイン</h4>
            </BaseButton>

            <a href="" className="text-zinc-500 hover:underline text-center">
              パスワードを忘れた方
            </a>
          </VerticalStackContainer>
        </VerticalStackContainer>
      </CenterContainer>
    </NavBar>
  );
};

export default DreamerLogin;
