import { motion } from "framer-motion";
import { BaseButton } from "@/components/ui/atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faTimes } from "@fortawesome/free-solid-svg-icons";

type SwipeResultMessageProps = {
    swipeDirection: "center" | "left" | "right";
    onReset: () => void;
};

export const SwipeResultMessage = ({
    swipeDirection,
    onReset,
}: SwipeResultMessageProps) => {
    if (swipeDirection === "center") return null;

    const isGood = swipeDirection === "right";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center z-50 min-w-full"
        >
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`inline-block mb-4 p-6 rounded-full ${
                    isGood ? "bg-green-100" : "bg-red-100"
                }`}
            >
                <FontAwesomeIcon
                    icon={isGood ? faThumbsUp : faTimes}
                    className={`text-5xl ${
                        isGood ? "text-green-500" : "text-red-500"
                    }`}
                />
            </motion.div>
            <p
                className={`mb-8 font-black text-2xl uppercase tracking-tighter italic ${
                    isGood ? "text-green-600" : "text-red-600"
                }`}
            >
                {isGood ? "Great! いいね！" : "Skip... パス"}
            </p>
            <BaseButton
                color="white"
                className="rounded-full! px-16 py-5 font-black shadow-2xl uppercase tracking-widest transition-transform active:scale-95"
                onClick={onReset}
            >
                次へ
            </BaseButton>
        </motion.div>
    );
};
