import { confirmSignUp, signUp } from "@aws-amplify/auth";
import { useRouter } from "next/router";
import { useState } from "react";

export const useSignUp = () => {
    const router = useRouter();
    
    const [step, setStep] = useState<"REGISTER" | "CONFIRM">("REGISTER");
    
    const [email, setEmail] = useState<string>("");
    const [confirmationCode, setConfirmationCode] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    /**
    
    会員登のメール認証開始関数

    Parameters
    ---------- 
        None

    Returns
    ----------
        None
    
    */
    const handleSignUp = async () => {
        setIsLoading(true);
        setError("");

        try {
            await signUp({
                username: email.trim(),

                options: {
                    userAttributes: {
                        "email": email,
                        "custom:account_type": "dreamer",
                    }
                }
            });

            setStep("CONFIRM");
            setConfirmationCode("");

        }catch (err: any) {
            console.log(err);   
            setError("サインアップ中にエラーが発生しました。");

        } finally {
            setIsLoading(false);

        }
    }

    /**
    
    会員登録のメール認証確認関数

    Parameters
    ---------- 
        None   
    
    Returns
    ----------
        None
        
    */
    const handleConfirmSignUp = async () => {
        setIsLoading(true);
        setError("");

        try {
            await confirmSignUp({
                username: email,
                confirmationCode,
            });

            router.push("/login/");
        }catch (err: any) {
            setError("メール認証に失敗しました");
        
        } finally {
            setIsLoading(false);
        
        }
    }

    return {
        step,
        email,
        setEmail,
        handleSignUp,
        setConfirmationCode,
        handleConfirmSignUp,
        isLoading,
        error
    }

}