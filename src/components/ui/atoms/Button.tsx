import { HorizontalStackContainer } from "../molecules/Container"
import { useState } from "react"
import { motion } from "framer-motion"
import { FiHeart } from "react-icons/fi";

import { VariantKey, variants, loading_variants } from "@/components/color";

// BaseButton
type BaseButtonType = {  
    color?: VariantKey
    children?: React.ReactNode
    className?: string
    isLoading?: boolean
    onClick?: () => void
}
export const BaseButton =  ({
    color = 'transparent',
    children,
    className = '',
    isLoading, 
    onClick 
}: BaseButtonType) => {
    return(
        <button className={`p-2 ${variants[color]} rounded-lg hover:cursor-pointer ${className}`} onClick={onClick} disabled={isLoading}>
            <HorizontalStackContainer space={8}>
                {isLoading ? (
                    <motion.div
                        className={`mx-auto h-4 w-4 border-2 border-t-transparent ${loading_variants[color]} rounded-full`}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                ) : (
                    <span className={`w-full text-center ${isLoading ? "opacity-50" : "opacity-100"}`}>
                        {children}
                    </span>
                )}
            </HorizontalStackContainer>
        </button>
    )
}


// IconButton
export const IconButton = ({
    color = 'transparent',
    children,
    className = '',
    isLoading, 
    onClick, 
    icon,
}: BaseButtonType & {icon: React.ReactNode}) => {
    return(
        <BaseButton color={color} className={className} isLoading={isLoading} onClick={onClick}>
            <HorizontalStackContainer space={2}>
                <span className="h-8 aspect-square flex justify-center items-center">
                    {icon}
                </span>
                {children}
            </HorizontalStackContainer>
        </BaseButton>
    )
}

// FavoriteButton
type FavoriteButtonType = {
    className?: string
    onToggle?: (isFavorite: boolean) => void
}
export const FavoriteButton = ({className = "", onToggle}: FavoriteButtonType) => {
    const [isFavorite, setIsFavorite] = useState(false)

    const handleClick = () => {
        const newState = !isFavorite
        setIsFavorite(newState)
        onToggle?.(newState)
    }

    return(
        <motion.button
            onClick={handleClick}
            className={`relative w-5 h-5 rounded-full transition-colors ${className}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <motion.div
                animate = {{
                    scale: isFavorite ? [1, 1.2, 1] : 1,
                    rotate: isFavorite ? [0, -5, 5, 0] : 0,
                }}

                transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                }}
            >
                <FiHeart 
                    className={`h-5 w-5 transition-colors duration-200 cursor-pointer ${isFavorite ? "fill-red-500 text-red-500" : " hover:text-red-300"}`}
                />
            </motion.div>

            {isFavorite && (
                <>
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-red-400 rounded-full"
                        initial={{
                            opacity: 0,
                            scale: 0,
                            x: 0,
                            y: 0,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: Math.cos((i * Math.PI * 2) / 4) * 15,
                            y: Math.sin((i * Math.PI * 2) / 4) * 15,
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            delay: 0.1,
                        }}
                        style={{
                            left: "50%",
                            top: "50%",
                        }}
                        />
                    ))}
                </>
            )}
        </motion.button>
    )
}