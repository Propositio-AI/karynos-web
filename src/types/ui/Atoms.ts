export type BaseButtonType = {  
    color: "black" | "white" | "transparent" | "None"
    children?: React.ReactNode
    className?: string
    variant?: string
    isLoading?: boolean
    onClick?: () => void
}

export type IconButtonType = BaseButtonType & {
    icon: any
}

export type BaseInputTextType = {
    value?: string
    placeholder?: string
    className?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
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
