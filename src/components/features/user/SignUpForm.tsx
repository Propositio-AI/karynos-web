import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import "@/lib/auth/amplify";
import { BaseButton, IconButton } from "@/components/ui/atoms/Button";
import { BaseInputText } from "@/components/ui/atoms/Input";
import { CenterContainer, HorizontalStackContainer, VerticalStackContainer } from "@/components/ui/molecules/Container";
import { FadeInAnimation } from "@/components/ui/molecules/Animation";

type Props = {
    step: string;
    email: string;
    onChangeEmail: (v: string) => void;
    handleSignUp: () => void;
    onChangeConfirmationCode: (v: string) => void;
    handleConfirmSignUp: () => void;
    isLoading: boolean;
    error: string;
};

export const SignUpForm = ({
    step,
    email,
    onChangeEmail,
    handleSignUp,
    onChangeConfirmationCode,
    handleConfirmSignUp,
    isLoading,
    error,
}: Props) => {
    return (
        <CenterContainer className="min-h-screen bg-canvas px-5 py-10">
            <VerticalStackContainer className="w-full max-w-md rounded-(--radius-lg) border border-line bg-surface p-8" space={8}>
                <div>
                    <p className="mb-4 text-sm font-semibold tracking-wide text-brand-700">
                        Karynos
                    </p>
                    <h1>アカウント作成</h1>
                    <p className="mt-3 text-sm leading-6 text-muted">
                        {step === "CONFIRM"
                            ? `${email} に送信された認証コードを入力してください。`
                            : "まずはメールアドレスを入力してください。"}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    <FadeInAnimation>
                        {step === "REGISTER" ? (
                            <VerticalStackContainer space={4}>
                                <BaseInputText
                                    className="w-full"
                                    label="メールアドレス"
                                    placeholder="you@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => onChangeEmail(e.target.value)}
                                />
                                <HorizontalStackContainer space={4} className="items-stretch">
                                    <IconButton
                                        icon={faArrowRightLong}
                                        className="w-full"
                                        color="emerald"
                                        isLoading={isLoading}
                                        onClick={handleSignUp}
                                    >
                                        コードを受け取る
                                    </IconButton>
                                </HorizontalStackContainer>
                            </VerticalStackContainer>
                        ) : (
                            <VerticalStackContainer space={4}>
                                <BaseInputText
                                    className="w-full tracking-[0.18em]"
                                    label="認証コード"
                                    placeholder="6桁のコード"
                                    onChange={(e) => onChangeConfirmationCode(e.target.value)}
                                />
                                <BaseButton
                                    color="emerald"
                                    className="w-full"
                                    isLoading={isLoading}
                                    onClick={handleConfirmSignUp}
                                >
                                    認証する
                                </BaseButton>
                            </VerticalStackContainer>
                        )}

                        {error && (
                            <div className="mt-4 rounded-(--radius-sm) border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                                {error}
                            </div>
                        )}
                    </FadeInAnimation>
                </AnimatePresence>

                <Link
                    href="/login"
                    className="text-center text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
                >
                    すでにアカウントをお持ちの方
                </Link>
            </VerticalStackContainer>
        </CenterContainer>
    );
};
