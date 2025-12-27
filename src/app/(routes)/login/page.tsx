"use client"

import LoginForm from "@/components/features/user/LoginForm";
import { useLogin } from "@/hooks/features/user/useLogin";

const Login = () => {
    const {
        step,
        email,
        isLoading,
        onChangeEmail,
        handleLogin,
        onChangeConfirmationCode,
        handleConfirmLogin,
        error,
    } = useLogin();

    return( 
        <LoginForm
            step = {step}
            email = {email}
            isLoading = {isLoading}
            onChangeEmail = {onChangeEmail}
            handleLogin = {handleLogin}
            onChangeConfirmationCode = {onChangeConfirmationCode} 
            handleConfirmLogin = {handleConfirmLogin}
            error = {error}
        />
   )
}

export default Login;