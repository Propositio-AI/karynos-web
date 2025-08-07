"use client"

import { motion, AnimatePresence } from "framer-motion"

import { IoMdHome, IoMdSearch, IoMdBook } from "react-icons/io";
import { VerticalStackContainer } from "../molecules/Container";
import { SideBarFooter } from "../molecules/SideBarFooter";
import { BaseButton, IconButton } from "../atoms/Button"

import { FaXmark } from "react-icons/fa6";
import { useState } from "react";

const menuItems = [
    {icon: IoMdHome, label: "ホーム", href: "/"},
    {icon: IoMdSearch, label: "アーカイブ", href: "/archive"},
    {icon: IoMdBook, label: "ダッシュボード", href: "/dashboard"},
]

const sideBarVariants = {
    open: {
        x: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    },
    closed: {
        x: "-100%",
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.05,
            staggerDirection: -1,
        }
    }
}

const itemVariants = {
    open: {
            opacity: 1,
            x: 0,
            transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    closed: {
            opacity: 0,
            x: -20,
            transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
}

const overlayVariants = {
    open: {
            opacity: 1,
            transition: {
            duration: 0.3,
        },
    },
    closed: {
            opacity: 0,
            transition: {
            duration: 0.3,
        },
    },
}

export const SideBar = () => {
    const[isOpen, setIsOpen] = useState(true)

    return(
        <>
            <AnimatePresence mode="wait">
                {isOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            variants={overlayVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            variants={sideBarVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed flex flex-col h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
                            >
                                <h1 className="m-2">Karynos</h1>
                                
                                <BaseButton variant="ghost" color="transparent" className="rounded-full" onClick={() => setIsOpen(false)}>
                                    <FaXmark />
                                </BaseButton>
                            </motion.div>
                        
                            <VerticalStackContainer space="1">
                                {menuItems.map((item, index) => (
                                    <motion.a
                                        key={index}
                                        variants={itemVariants}
                                        href={item.href}
                                        className="flex items-center px-4 py-1 transition-colors group"
                                    >
                                        <IconButton className="w-full" color="transparent" icon={<item.icon size={"100%"}/>}>
                                            <h4>{item.label}</h4>
                                        </IconButton>
                                    </motion.a>
                                ))}
                            </VerticalStackContainer>
                            <motion.div
                                variants={itemVariants}
                                className="px-4 mt-auto"
                            >
                                <SideBarFooter className="mt-auto"/>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}