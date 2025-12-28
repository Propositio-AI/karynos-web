import { confirmSignIn, signIn } from "@aws-amplify/auth";
import { useState } from "react";

export const useLogin = () => {
    const [step, setStep] = useState<"LOGIN" | "CONFIRM" | "CREATE_ACCOUNT">("CREATE_ACCOUNT");
        
    const [email, setEmail] = useState<string>("");
    const [confirmationCode, setConfirmationCode] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");    

    const handleLogin = async () => {
        setIsLoading(true);
        setError("");

        try {
            const {isSignedIn} = await signIn({
                username: email,
                options: {
                    authFlowType: "USER_AUTH",
                    preferredChallenge: 'EMAIL_OTP',
                },
            });

            setStep("CONFIRM");

        } catch (err: any) {
            console.log(err);
            setError(err.message || "ログイン中にエラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    }

    const handleConfirmLogin = async () => {
        try {
            const { nextStep: confirmSignInNextStep } = await confirmSignIn({
                challengeResponse: confirmationCode,
            });

            if (confirmSignInNextStep.signInStep === "DONE") {
                setError("");
            }
        } catch (err) {
            setError("サインイン中にエラーが発生しました");
        }
    }

    return {
        step,
        email,
        isLoading,
        setEmail,
        handleLogin,
        setConfirmationCode,
        handleConfirmLogin,
        error,
    }
}