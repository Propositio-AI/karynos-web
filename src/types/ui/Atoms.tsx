export type BaseButtonType = {  
    color: "black" | "white" | "transparent" | "None"
    children?: React.ReactNode
    className?: string
    variant?: string
    onClick?: () => void

}

export type IconButtonType = {
    color: "black" | "white" | "transparent"
    icon: any
    children?: React.ReactNode
    className?: string
    variant?: string
    onClick?: () => void

}

export type BaseInputTextType = {
    value?: string
    placeholder?: string
    className?: string
}

export type FavoriteButtonType = {
    className?: string
    onToggle?: (isFavorite: boolean) => void
}

export type PagaeTitleType = {
    number: number
    title: string
    className?: string
}

export type SectionTitleType = {
    number: string
    title: string
    className?: string
}

export type TextContentsType = {
    text?: string
    clasName?: string
}
