export type BaseButtonProps = {  
    children?: React.ReactNode
    className?: string
    color: "black" | "white" | "transparent"
}

export type IconButtonProps = {
    children?: React.ReactNode
    className?: string
    color: "black" | "white" | "transparent"
    icon: any
}

export type BaseInputTextProps = {
    value?: string
    placeholder?: string
    className?: string
}

