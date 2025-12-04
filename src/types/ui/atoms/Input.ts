export type BaseInputTextType = {
    value?: string
    placeholder?: string
    type?: "number" | "text" | "password"
    className?: string
    label?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}