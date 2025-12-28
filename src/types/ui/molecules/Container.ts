export type BaseContainerType = {
    children?: React.ReactNode
    className?: string
}

export type spaceNumberType = 0 | 1 | 2 | 4 | 8 | 12 | 16

export type StackContainerType = {
    children?: React.ReactNode
    className?: string
    space?: spaceNumberType
    onClick?: () => void
}

export type GridContainerType = {
    children?: React.ReactNode
    minWidth?: number
    className?: string
}