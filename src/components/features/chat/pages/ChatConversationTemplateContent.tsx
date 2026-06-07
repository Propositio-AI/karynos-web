"use client";

import { motion } from "framer-motion";

export default function ChatConversationTemplateContent({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<motion.div
			initial={{ x: "100%" }}
			animate={{ x: 0 }}
			exit={{ x: "100%" }}
			transition={{ type: "spring", damping: 25, stiffness: 200 }}
			className="fixed inset-0 z-50 bg-white"
		>
			{children}
		</motion.div>
	);
}
