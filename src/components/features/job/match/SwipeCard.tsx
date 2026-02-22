import { motion, AnimatePresence, easeIn, MotionValue, useTransform } from "framer-motion";
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
    // ドラッグ中の動的フィードバック
    const scale = useTransform(x, [-300, -200, 0, 200, 300], [0.95, 0.9, 1, 0.9, 0.95]);
    const backgroundColor = useTransform(
        x,
        [-300, -200, 0, 200, 300],
        ["rgba(239, 68, 68, 0.4)", "rgba(239, 68, 68, 0.2)", "rgba(255, 255, 255, 0)", "rgba(34, 197, 94, 0.2)", "rgba(34, 197, 94, 0.4)"]
    );
    
    // いいねアイコン表示
    const likeOpacity = useTransform(x, [0, 100, 200], [0, 0, 1]);
    const likeScale = useTransform(x, [0, 100, 200], [0.5, 0.7, 1]);
    
    // パスアイコン表示
    const passOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);
    const passScale = useTransform(x, [-200, -100, 0], [1, 0.8, 0.5]);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
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
                    className="relative w-5/6 max-w-[720px] h-[70vh] min-h-[520px] bg-white shadow-2xl rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border border-zinc-100"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={onDragEnd}
                    initial="center"
                    animate={expanded ? "expanded" : "center"}
                    variants={{
                        center: {
                            x: 0,
                            height: "66%",
                            scale: 1,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                            },
                        },
                        expanded: {
                            height: "90%",
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
                    {/* 子要素 */}
                    {children}
                    
                    {/* オーバーレイ */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                            backgroundColor: backgroundColor as any,
                        }}
                    />
                    
                    {/* いいねアイコン（右スワイプ） */}
                    <motion.div
                        className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                            opacity: likeOpacity as any,
                            scale: likeScale as any,
                        }}
                    >
                        <div className="inline-block p-4 rounded-full bg-green-100">
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                className="text-4xl text-green-500"
                            />
                        </div>
                    </motion.div>
                    
                    {/* パスアイコン（左スワイプ） */}
                    <motion.div
                        className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                            opacity: passOpacity as any,
                            scale: passScale as any,
                        }}
                    >
                        <div className="inline-block p-4 rounded-full bg-red-100">
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="text-4xl text-red-500"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};
