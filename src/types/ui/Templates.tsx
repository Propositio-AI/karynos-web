export type AuthSendType = {
    email: string
    type: "login" | "signup"
    className?: string
}

export type AuthFormType = {
    type: "login" | "signup"
}

export type SideBarFooterType = {
    className?: string
}

export type AnimatedSidebarProps = {
  isOpen: boolean
  onClose: () => void
}



export type StudyActivityType = {
    activity: number[][]
}