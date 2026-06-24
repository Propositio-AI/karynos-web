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
                className={`mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full border ${
                    isGood
                        ? "border-brand-200 bg-brand-50 text-brand-700"
                        : "border-line bg-surface text-muted"
                }`}
            >
                <FontAwesomeIcon icon={isGood ? faThumbsUp : faTimes} className="text-3xl" />
            </motion.div>
            <p
                className={`mb-8 text-xl font-semibold ${
                    isGood ? "text-brand-700" : "text-muted"
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
