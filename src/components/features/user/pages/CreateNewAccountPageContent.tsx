"use client";

import CreateNewAccount from "@/components/features/user/CreateNewAccount";
import { useCreateAccount } from "@/hooks/features/user/useCreateAccount";

export default function CreateNewAccountPageContent() {
	const { familyName, givenName, isLoading, error, setFamilyName, setGivenName, createAccount } =
		useCreateAccount();

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
}
