"use client";

import CreateNewAccount from "@/components/features/user/createNewAcount";
import { useCreateAccount } from "@/hooks/features/user/useCreateAcount";

const CreateNewAccountPage = () => {
    const {
        familyName,
        givenName,
        isLoading,
        error,
        setFamilyName,
        setGivenName,
        createAccount,
    } = useCreateAccount();

    return (
        <CreateNewAccount
            familyName={familyName}
            givenName={givenName}
            error={error}
            isLoading={isLoading}
            onChangeFamilyName={setFamilyName}
            onChangeGivenName={setGivenName}
            onSubmit={createAccount}
        />
    );
};

export default CreateNewAccountPage;
