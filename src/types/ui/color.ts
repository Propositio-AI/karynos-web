export type ColorVariantKey = 'slate' | 'white' | 'emerald' | 'blue'

export const ColorVariants: Record<ColorVariantKey, string> = {
    slate: "bg-slate-900 text-white hover:bg-slate-700",
    white: "border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-200",
    emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
    blue: "bg-blue-500 text-white hover:bg-ble-400",
}

export const LoadingColorVariants: Record<ColorVariantKey, string> = {
    slate: "border-white",
    white: "border-black",
    emerald: "border-white",
    blue: "border-white",
}