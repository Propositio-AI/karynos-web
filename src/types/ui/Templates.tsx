export type AuthSendType = {
    email: string
    type: "login" | "signup"
    className?: string
}

export type AuthFormType = {
    type: "login" | "signup"
}