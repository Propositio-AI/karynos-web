import { confirmLogin, startLogin, startTestLogin } from "@/lib/auth/session";
import { isCognitoConfigured } from "@/lib/auth/amplify";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLogin = () => {
    const router = useRouter();
    const [step, setStep] = useState<"LOGIN" | "CONFIRM">("LOGIN");
    const [email, setEmail] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [confirmationCode, setConfirmationCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const isTestLogin = !isCognitoConfigured();

    const redirectAfterLogin = () => {
        router.replace("/job/match");
    };

    const handleLogin = async () => {
        setIsLoading(true);
        setError("");

        try {
            if (isTestLogin) {
                await startTestLogin(email, grade);
                redirectAfterLogin();
                return;
            }

            const result = await startLogin(email);
            if (result.step === "DONE") {
                redirectAfterLogin();
                return;
            }

            setStep("CONFIRM");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Sign in failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmLogin = async () => {
        setIsLoading(true);
        setError("");

        try {
            const result = await confirmLogin(confirmationCode);
            if (result.step === "DONE") {
                redirectAfterLogin();
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const onChangeEmail = (v: string) => setEmail(v);
    const onChangeGrade = (v: string) => setGrade(v);
    const onChangeConfirmationCode = (v: string) => setConfirmationCode(v);

    return {
        step,
        email,
        grade,
        isTestLogin,
        confirmationCode,
        isLoading,
        setEmail,
        setGrade,
        onChangeEmail,
        onChangeGrade,
        handleLogin,
        setConfirmationCode,
        onChangeConfirmationCode,
        handleConfirmLogin,
        error,
    };
};
