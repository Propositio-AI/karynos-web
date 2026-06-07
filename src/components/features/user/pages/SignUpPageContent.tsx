"use client";

import { SignUpForm } from "@/components/features/user/SignUpForm";
import { useSignUp } from "@/hooks/features/user/useSignUp";

export default function SignUpPageContent() {
	const {
		step,
		email,
		setEmail,
		handleSignUp,
		setConfirmationCode,
		handleConfirmSignUp,
		isLoading,
		error,
	} = useSignUp();

	return (
		<SignUpForm
			step={step}
			email={email}
			onChangeEmail={setEmail}
			handleSignUp={handleSignUp}
			onChangeConfirmationCode={setConfirmationCode}
			handleConfirmSignUp={handleConfirmSignUp}
			isLoading={isLoading}
			error={error}
		/>
	);
}
