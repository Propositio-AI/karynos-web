import { easeIn, motion, MotionValue, useTransform } from "framer-motion";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faXmark } from "@fortawesome/free-solid-svg-icons";

type SwipeCardProps = {
    swipeDirection: "center" | "left" | "right";
    x: MotionValue<number>;
    rotate: MotionValue<number>;
    opacity: MotionValue<number>;
    expanded: boolean;
    customDirection: number;
    onDragEnd: (event: any, info: any) => void;
    children: ReactNode;
};

export const SwipeCard = ({
    swipeDirection,
    x,
    rotate,
    opacity,
    expanded,
    customDirection,
    onDragEnd,
    children,
}: SwipeCardProps) => {
    const likeOpacity = useTransform(x, [0, 100, 200], [0, 0.2, 1]);
    const likeScale = useTransform(x, [0, 100, 200], [0.7, 0.9, 1]);
    const passOpacity = useTransform(x, [-200, -100, 0], [1, 0.2, 0]);
    const passScale = useTransform(x, [-200, -100, 0], [1, 0.9, 0.7]);

    return (
        <div className="relative flex h-full w-full items-center justify-center">
            {swipeDirection === "center" && (
                <motion.div
                    key="main-card"
                    custom={customDirection}
                    exit="exit"
                    style={{
                        x,
                        rotate,
                        opacity,
                        willChange: "transform, opacity",
                    }}
                    className="relative h-[62vh] min-h-[520px] w-full max-w-[720px] cursor-grab overflow-hidden rounded-(--radius-lg) border border-line bg-surface shadow-lift active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={onDragEnd}
                    initial="center"
                    animate={expanded ? "expanded" : "center"}
                    variants={{
                        center: {
                            x: 0,
                            height: "62vh",
                            scale: 1,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                            },
                        },
                        expanded: {
                            height: "calc(100vh - 8rem)",
                            scale: 1,
                            transition: {
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                            },
                        },
                        exit: (direction: number) => ({
                            x: direction * 1000,
                            opacity: 0,
                            rotate: direction * 45,
                            scale: 0.8,
                            transition: {
                                duration: 0.5,
                                ease: easeIn,
                            },
                        }),
                    }}
                >
                    {children}

                    <motion.div
                        className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2"
                        style={{
                            opacity: likeOpacity as any,
                            scale: likeScale as any,
                        }}
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-700">
                            <FontAwesomeIcon icon={faThumbsUp} className="text-2xl" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2"
                        style={{
                            opacity: passOpacity as any,
                            scale: passScale as any,
                        }}
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface text-muted">
                            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};
