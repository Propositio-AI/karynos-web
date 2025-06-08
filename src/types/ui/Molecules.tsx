export type BaseContainerProps = {
    children?: React.ReactNode
    className?: string
}

export type StackContainerProps = {
    children?: React.ReactNode
    className?: string
    space:  "0" | "1" | "2" | "4" | "8"
}