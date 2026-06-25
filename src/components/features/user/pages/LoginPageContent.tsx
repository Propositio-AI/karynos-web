"use client";

import LoginForm from "@/components/features/user/LoginForm";
import { useLogin } from "@/hooks/features/user/useLogin";

export default function LoginPageContent() {
	const {
		step,
		email,
		grade,
		isTestLogin,
		confirmationCode,
		isLoading,
		setEmail,
		setGrade,
		handleLogin,
		setConfirmationCode,
		handleConfirmLogin,
		error,
	} = useLogin();

	return (
		<LoginForm
			step={step}
			email={email}
			grade={grade}
			isTestLogin={isTestLogin}
			confirmationCode={confirmationCode}
			isLoading={isLoading}
			onChangeEmail={setEmail}
			onChangeGrade={setGrade}
			handleLogin={handleLogin}
			onChangeConfirmationCode={setConfirmationCode}
			handleConfirmLogin={handleConfirmLogin}
			error={error}
		/>
	);
}
