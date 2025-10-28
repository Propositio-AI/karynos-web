import { HorizontalStackContainer, VerticalStackContainer } from "../molecules/Container"
import { useState } from "react"
import { motion } from "framer-motion"
import { FiHeart } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { faFireFlameSimple, faMagnifyingGlass, faHouse, faMap, faUser } from "@fortawesome/free-solid-svg-icons";

import { BaseButtonType } from "@/types/ui/atoms/Button";
import { ColorVariants, LoadingColorVariants } from "@/types/ui/color";
import { NavType } from "@/types/ui/atoms/Button";

/**

BaseButton コンポーネント

共通のボタンコンポーネント

props:
- color: ボタンのカラーバリアント
- children: ボタン内に表示するコンテンツ
- className: 追加のCSSクラス
- isLoading: ローディング状態かどうか
- onClick: クリック時のコールバック関数
 
**/
export const BaseButton =  ({
    color = 'white',
    children,
    className = '',
    isLoading, 
    onClick 
}: BaseButtonType) => {
    return(
        <button className={`p-2 ${ColorVariants[color]} rounded-lg hover:cursor-pointer ${className}`} onClick={onClick} disabled={isLoading}>
            <HorizontalStackContainer space={8}>
                {isLoading ? (
                    <motion.div
                        className={`mx-auto h-4 w-4 border-2 border-t-transparent ${LoadingColorVariants[color]} rounded-full`}
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


/** 

IconButton コンポーネント

アイコン付きのボタンコンポーネント

props
- color: ボタンのカラーバリアント
- children: ボタン内に表示するコンテンツ
- className: 追加のCSSクラス
- isLoading: ローディング状態かどうか
- onClick: クリック時のコールバック関数
- icon: ボタンに表示するアイコンコンポーネント

**/
export const IconButton = ({
    color = 'white',
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

/**

FabButton コンポーネント

props:
- className: 追加のCSSクラス
- onClick: クリック時のコールバック関数 

**/
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

export const NavIcon = ({type, active}: {type: NavType, active: boolean}) => {
    const map: Record<NavType, {icon: IconDefinition, label: string}> = {
        match: {icon: faFireFlameSimple, label: "マッチ"},
        explore: {icon: faMagnifyingGlass, label: "探検"},
        home: {icon: faHouse, label: "ホーム"},
        map: {icon: faMap, label: "地図"},
        setting: {icon: faUser, label: "設定"},
    };

    const {icon, label} = map[type];

    return (
            (active) ? (
            <VerticalStackContainer space={0} className="w-16 h-16 text-center">
                <FontAwesomeIcon icon={icon} className="p-2 bg-emerald-500 text-white rounded-lg"/>
                <p className="font-semibold text-sm text-emerald-500">{label}</p>
            </VerticalStackContainer>
        ) : (
            <VerticalStackContainer space={0} className="w-16 h-16 text-center">
                <FontAwesomeIcon icon={icon} className="p-2 hover:bg-zinc-200 text-zinc-500 rounded-lg"/>
                <p className="font-semibold text-sm text-zinc-500">{label}</p>
            </VerticalStackContainer>
        )
    )
}