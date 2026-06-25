"use client";

import LoginForm from "@/components/features/user/LoginForm";
import { useLogin } from "@/hooks/features/user/useLogin";

const Login = () => {
	const {
		step,
		email,
		grade,
		isTestLogin,
		confirmationCode,
		isLoading,
		onChangeEmail,
		onChangeGrade,
		handleLogin,
		onChangeConfirmationCode,
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
			onChangeEmail={onChangeEmail}
			onChangeGrade={onChangeGrade}
			handleLogin={handleLogin}
			onChangeConfirmationCode={onChangeConfirmationCode}
			handleConfirmLogin={handleConfirmLogin}
			error={error}
		/>
	);
};

export default Login;
