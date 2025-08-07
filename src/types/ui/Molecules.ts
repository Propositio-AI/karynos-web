export type BaseContainerProps = {
    children?: React.ReactNode
    className?: string
}

export type GridContainerType = {
    children?: React.ReactNode
    minWidth: string | number
    className?: string
}

export type StackContainerProps = {
    children?: React.ReactNode
    className?: string
    space:  "0" | "1" | "2" | "4" | "8"
}

export type DashboardCardType = {
    title: string
    icon?: React.ReactNode 
    value: string
    timeChange?: string
}

export type TextBookCardType = {
    className?: string
    title: string
    date: string
    description: string
    percent: number
    favorite: boolean
}

export type BaseColumnCardType = {
    type: "definition" | "theorem" | "example" | "column" | "formula"
    title?: string
    children?: React.ReactNode
    className?: string
}