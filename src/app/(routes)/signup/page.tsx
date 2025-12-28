"use client"

import { CenterContainer, HorizontalStackContainer, VerticalStackContainer } from "@/components/ui/molecules/Container"
import { BaseInputText } from "@/components/ui/atoms/Input"
import { BaseButton, IconButton } from "@/components/ui/atoms/Button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import '@/lib/auth/amplify';
import { AnimatePresence } from "framer-motion"
import { FadeInAnimation } from "@/components/ui/molecules/Animation"
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import { SignUpForm } from "@/components/features/user/SignUpForm"
import { useSignUp } from "@/hooks/features/user/useSignUp"

const SignUp = () => {
    const {
        step,
        email,
        onChangeEmail,
        handleSignUp,
        onChangeConfirmationCode,
        handleConfirmSignUp,
        isLoading,
        error
    } = useSignUp();
    
    return( 
        <SignUpForm
            step = {step}
            email = {email}
            onChangeEmail = {onChangeEmail}
            handleSignUp = {handleSignUp}
            onChangeConfirmationCode = {onChangeConfirmationCode}
            handleConfirmSignUp = {handleConfirmSignUp}
            isLoading = {isLoading}
            error = {error}
        />    
   )
}

export default SignUp;