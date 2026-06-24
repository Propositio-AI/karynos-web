"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { BaseButton } from "@/components/ui/atoms/Button";
import { BaseInputText } from "@/components/ui/atoms/Input";
import { CenterContainer, VerticalStackContainer } from "@/components/ui/molecules/Container";
import { FadeInAnimation } from "@/components/ui/molecules/Animation";

type Props = {
    step: "LOGIN" | "CONFIRM";
    email: string;
    confirmationCode: string;
    isLoading: boolean;
    onChangeEmail: (v: string) => void;
    onChangeConfirmationCode: (v: string) => void;
    handleLogin: () => void;
    handleConfirmLogin: () => void;
    error: string;
};

const LoginForm = ({
    step,
    email,
    confirmationCode,
    isLoading,
    onChangeEmail,
    onChangeConfirmationCode,
    handleLogin,
    handleConfirmLogin,
    error,
}: Props) => {
    const submit = () => {
        if (step === "LOGIN") {
            handleLogin();
            return;
        }

        handleConfirmLogin();
    };

    return (
        <CenterContainer className="min-h-screen bg-canvas px-5 py-10">
            <VerticalStackContainer className="w-full max-w-md rounded-(--radius-lg) border border-line bg-surface p-8" space={8}>
                <div>
                    <p className="mb-4 text-sm font-semibold tracking-wide text-brand-700">
                        Karynos
                    </p>
                    <h1 className="text-ink">
                        {step === "LOGIN" ? "おかえりなさい" : "認証コードを入力"}
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-muted">
                        {step === "LOGIN"
                            ? "メールアドレスだけで、あなたのキャリア探索を再開できます。"
                            : `${email} に届いたコードを入力してください。`}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    <FadeInAnimation>
                        <VerticalStackContainer space={4}>
                            {step === "LOGIN" ? (
                                <BaseInputText
                                    className="w-full"
                                    label="メールアドレス"
                                    placeholder="you@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => onChangeEmail(e.target.value)}
                                />
                            ) : (
                                <BaseInputText
                                    className="w-full tracking-[0.18em]"
                                    label="認証コード"
                                    placeholder="6桁のコード"
                                    value={confirmationCode}
                                    onChange={(e) => onChangeConfirmationCode(e.target.value)}
                                />
                            )}

                            {error && (
                                <p className="rounded-(--radius-sm) border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <BaseButton
                                color="emerald"
                                className="w-full"
                                isLoading={isLoading}
                                onClick={submit}
                            >
                                {step === "LOGIN" ? "ログイン" : "認証して進む"}
                            </BaseButton>

                            <Link
                                href="/signup"
                                className="text-center text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
                            >
                                はじめての方はアカウント作成へ
                            </Link>
                        </VerticalStackContainer>
                    </FadeInAnimation>
                </AnimatePresence>
            </VerticalStackContainer>
        </CenterContainer>
    );
};

export default LoginForm;
