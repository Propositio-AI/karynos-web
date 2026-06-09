export type BaseInputTextType = {
    type?: "number" | "text" | "password"
    value?: string
    placeholder?: string
    className?: string
    label?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
