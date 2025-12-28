export type BaseInputTextType = {
    type?: "text" | "number"
    value?: string
    placeholder?: string
    className?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}