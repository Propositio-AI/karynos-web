"use client"

import { BaseButtonType, FavoriteButtonType, IconButtonType } from "@/types/ui/Atoms"
import { HorizontalStackContainer } from "../molecules/Container"
import { useState } from "react"
import {motion} from "framer-motion"
import { FiHeart } from "react-icons/fi";

export const BaseButton = (props: BaseButtonType) => {
    const variants = {
        black: "bg-black text-white hover:bg-gray-900",
        white: "bg-white text-blue-500 hover:bg-gray-500",
        transparent: "text-black hover:bg-gray-100",
        None: "",
    }

    const loading_variants = {
        black: "border-white",
        white: "border-black",
        transparent: "border-black",
        None: "border-black",
    }

    const color = variants[props.color] ?? variants["black"]
    const loading_color = loading_variants[props.color] ?? loading_variants["black"]

    return(
        <button className={`p-2 ${color} rounded-lg hover:cursor-pointer ${props.className ?? ""}`} onClick={props.onClick} disabled={props.isLoading}>
            <HorizontalStackContainer space="8">
                {props.isLoading ? (
                    <motion.div
                        className={`mx-auto h-4 w-4 border-2 border-t-transparent ${loading_color}  rounded-full`}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                ) : (
                    <span className={`w-full text-center ${props.isLoading ? "opacity-50" : "opacity-100"}`}>
                        {props.children}
                    </span>
                )}
            </HorizontalStackContainer>
        </button>
    )
}

export const IconButton = (props: IconButtonType) => {
    return(
        <BaseButton {...props}>
            <HorizontalStackContainer space="2">
                <span className="h-8 aspect-square flex justify-center items-center">
                    {props.icon}
                </span>
                {props.children}
            </HorizontalStackContainer>
        </BaseButton>
    )
}

export const FavoriteButton = (props: FavoriteButtonType) => {
    const [isFavorite, setIsFavorite] = useState(false)

    const handleClick = () => {
        const newState = !isFavorite
        setIsFavorite(newState)
        props.onToggle?.(newState)
    }

    return(
        <motion.button
            onClick={handleClick}
            className={`relative w-5 h-5 rounded-full transition-colors ${props.className}`}
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