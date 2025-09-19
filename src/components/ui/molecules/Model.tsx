"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { IoIosClose } from "react-icons/io";

import { HorizontalStackContainer } from "./Container";
import { IconButton } from "../atoms/Button";

type SimpleMpdalType = {  
    isOpen: boolean
    setIsOpen: (falg: boolean) => void
    title?: string
    children?: React.ReactNode
    className?: string
}

export const SimpleModal = (props: SimpleMpdalType) =>  {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <AnimatePresence>
        {props.isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => props.setIsOpen(false)}
            ></motion.div>

            <motion.div
              className="fixed z-100 inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.25 }}
            >
              <div className={`rounded-2xl bg-white p-6 shadow-xl ${props.className}`}>
                <HorizontalStackContainer space={2}>
                    <h3 className="w-11/12">{props.title}</h3>
                    <IconButton icon={<IoIosClose size={"90%"}/>} color="transparent" className="rounded-full" onClick={() => props.setIsOpen(false)}></IconButton>                                    
                </HorizontalStackContainer>
                {props.children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
