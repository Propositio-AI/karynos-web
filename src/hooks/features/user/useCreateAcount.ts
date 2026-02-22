import { useState } from "react";
import { useRouter } from "next/navigation";
import APIcall from "@/lib/api-client/api-call";
import { ApiErrorResponse } from "@/lib/api-client/type";
import { NewDreamerRequest, NewDreamerResponse } from "@/types/api/dreamer";
import { AcountType } from "@/types/common";

export const useCreateAccount = () => {
    const router = useRouter();

    const [accountType] = useState<AcountType>("dreamer");
    const [familyName, setFamilyName] = useState("");
    const [givenName, setGivenName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUnauthenticated = () => {
        router.push("/login");
    };

    const createAccount = async () => {
        try {
        setIsLoading(true);
        setError("");

        if (accountType === "dreamer") {
            await APIcall<NewDreamerRequest, NewDreamerResponse>(
                "POST",
                "http://localhost:5021/dreamer/api/v1/admin/new",
                {
                    data: {
                    organization_id: 0,
                    name_family: familyName,
                    name_given: givenName,
                    },
                },
                async () => {
                    setFamilyName("");
                    setGivenName("");
                },
                async () => {
                    // setError(error.message);
                },
                handleUnauthenticated
                );
            }
        } catch {
            setError("アカウント作成中にエラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        familyName,
        givenName,
        isLoading,
        error,
        setFamilyName,
        setGivenName,
        createAccount,
    };
};
