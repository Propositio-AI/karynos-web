"use client";

import LoginForm from "@/components/features/user/LoginForm";
import { useLogin } from "@/hooks/features/user/useLogin";

export default function LoginPageContent() {
	const {
		step,
		email,
		isLoading,
		setEmail,
		handleLogin,
		setConfirmationCode,
		handleConfirmLogin,
		error,
	} = useLogin();

	return (
		<LoginForm
			step={step}
			email={email}
			isLoading={isLoading}
			onChangeEmail={setEmail}
			handleLogin={handleLogin}
			onChangeConfirmationCode={setConfirmationCode}
			handleConfirmLogin={handleConfirmLogin}
			error={error}
		/>
	);
}
