import { motion } from "framer-motion"

/**

SimpleAnimatePing コンポーネント

**/
export const SimpleAnimatePing = () => {
    return(
        <div className="flex justify-center" aria-label="読み込み中">
            <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
            <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full mx-4"></div>
            <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
        </div>
    )
}

/**

GeneratingPing コンポーネント

**/
export const GeneratingPing = () => {
    return(
        <div className="flex items-center">
            <div className="animate-ping h-2 w-2 bg-brand-600 rounded-full"></div>
        </div>
    )
}

/**

FadeInAnimation コンポーネント

props:
- children: アニメーションさせるコンテンツ
- duration: アニメーションの継続時間（秒）
 
*/
export const FadeInAnimation = ({ children, className, duration = 0.5 }: {children: React.ReactNode, className?: string, duration?: number}) => {
    return(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration }}
            className={className}
        >
            {children}
        </motion.div>
    )
}