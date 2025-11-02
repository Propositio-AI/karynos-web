"use client"
import { motion } from "framer-motion"

import { JobCard } from "@/components/features/job-match"
import { CenterContainer } from "@/components/ui/molecules/Container"
import { NavBar } from "@/components/ui/templates/NavBar"
import { useState } from "react"


const JobMatching = () => {
    const [direction, setDirection] = useState<"left" | "right" | null>(null);
    const [cards, setCards] = useState([1, 2, 3, 4, 5])
    const [currentIndex, setCurrentIndex] = useState(0)
    
    const handleClick = (e: React.MouseEvent) => {
        if (currentIndex >= cards.length) return;
        
        const clickX = e.clientX;
        const screenWidth = window.innerWidth;

        if(clickX < screenWidth / 2) {
            console.log("Left side clicked");
            setDirection("left");
        } else {
            console.log("Right side clicked");
            setDirection("right");
        }
    }

    return( 
        <NavBar match={true} explore={false} home={false} map={false} setting={false}>
            <div onClick={handleClick} className="w-full h-full">
                {currentIndex < cards.length ? (
                    <motion.div
                        key={cards[currentIndex]}
                        className="w-full h-full"
                        initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.5 }}
                        animate={
                            direction == "right" 
                            ? {x: 800, y: -100, rotate: 20, opacity: 0, scale: 1}
                            : direction == "left"
                            ? {x: -800, y: -100, rotate: -20, opacity: 0, scale: 1}
                            : {x: 0, y: 0, rotate: 0, opacity: 1, scale: 1}
                        }
                        transition = {{
                            type: "spring",      
                            stiffness: 150,      
                            damping: 20,         
                            duration: 0.5 
                        }}      
                        onAnimationComplete={() => {
                            if (direction) {
                                setCurrentIndex(prev => prev + 1)
                                setDirection(null)
                            }
                        }}
                    >
                        <CenterContainer className="w-full h-full">
                            <JobCard></JobCard>
                        </CenterContainer>
                    </motion.div>
                ) : (
                    <CenterContainer className="w-full h-full">
                        <div className="text-center">
                            <p className="text-xl font-semibold">全てのカードを確認しました</p>
                        </div>
                    </CenterContainer>
                )}
            </div>
        </NavBar>
   )
}

export default JobMatching