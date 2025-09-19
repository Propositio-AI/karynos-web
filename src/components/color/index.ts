export type VariantKey = 'black' | 'white' | 'transparent'

export const variants: Record<VariantKey, string> = {
    black: "bg-black text-white hover:bg-gray-900",
    white: "bg-white text-blue-500 hover:bg-gray-500",
    transparent: "text-black hover:bg-gray-100",
}

export const loading_variants: Record<VariantKey, string> = {
    black: "border-white",
    white: "border-black",
    transparent: "border-black",
}