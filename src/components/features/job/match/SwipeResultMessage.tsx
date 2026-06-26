import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import { BaseButton } from "@/components/ui/atoms/Button";

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
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="z-50 min-w-full px-6 text-center"
        >
            <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className={`mb-5 inline-flex h-24 w-24 items-center justify-center rounded-full border shadow-lift ${
                    isGood
                        ? "border-brand-200 bg-brand-50 text-brand-600"
                        : "border-red-200 bg-red-50 text-red-500"
                }`}
            >
                <FontAwesomeIcon icon={isGood ? faThumbsUp : faTimes} className="text-5xl" />
            </motion.div>
            <p
                className={`mb-8 text-2xl font-extrabold ${
                    isGood ? "text-brand-700" : "text-red-600"
                }`}
            >
                {isGood ? "いいねしました" : "パスしました"}
            </p>
            <BaseButton
                color="white"
                className="mx-auto w-full max-w-xs"
                onClick={onReset}
            >
                次へ
            </BaseButton>
        </motion.div>
    );
};
