"use client";

import { motion, AnimatePresence } from "framer-motion";

import { faClose } from "@fortawesome/free-solid-svg-icons";
import { HorizontalStackContainer } from "./Container";
import { IconButton } from "../atoms/Button";
import { SimpleMpdalType } from "@/types/ui/molecules/Modal";

export const SimpleModal = (props: SimpleMpdalType) =>  {
	return (
		<div className="absolute flex h-screen items-center justify-center">
			<AnimatePresence>
				{props.isOpen && (
					<>
						<motion.div
							className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.15 }}
							onClick={() => props.setIsOpen(false)}
						></motion.div>

						<motion.div
							className="fixed z-100 inset-0 flex items-center justify-center p-4"
							initial={{ opacity: 0, scale: 0.97 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.97 }}
							transition={{ duration: 0.15 }}
						>
						<div className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-(--radius-lg) border border-line bg-white p-6 shadow-lift ${props.className}`}>
							<HorizontalStackContainer space={2} className="mb-4 justify-between">
								<h3 className="w-11/12">{props.title}</h3>
								<IconButton icon={faClose} color="white" className="h-9! min-h-0! w-9! rounded-full! border-none! p-0!" onClick={() => props.setIsOpen(false)}></IconButton>
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
