import { confirmSignUp, signUp } from "@aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useSignUp = () => {
    const router = useRouter();

    const [step, setStep] = useState<"REGISTER" | "CONFIRM">("REGISTER");
    const [email, setEmail] = useState<string>("");
    const [confirmationCode, setConfirmationCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleSignUp = async () => {
        setIsLoading(true);
        setError("");
        try {
            await signUp({
                username: email.trim(),
                options: {
                    userAttributes: {
                        email,
                        "custom:account_type": "dreamer",
                    },
                },
            });
            setStep("CONFIRM");
            setConfirmationCode("");
        } catch (err: unknown) {
            console.error(err);
            setError("サインアップ中にエラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmSignUp = async () => {
        setIsLoading(true);
        setError("");
        try {
            await confirmSignUp({ username: email, confirmationCode });
            router.push("/login/");
        } catch {
            setError("メール認証に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    const onChangeEmail = (v: string) => setEmail(v);
    const onChangeConfirmationCode = (v: string) => setConfirmationCode(v);

    return {
        step,
        email,
        setEmail,
        onChangeEmail,
        handleSignUp,
        setConfirmationCode,
        onChangeConfirmationCode,
        handleConfirmSignUp,
        isLoading,
        error,
    };
};
