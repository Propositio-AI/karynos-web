import { motion } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tag } from "@/components/ui/atoms/Text"
import { BaseButton } from "@/components/ui/atoms/Button"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { GridContainer, HorizontalStackContainer } from "../ui/molecules/Container";

export const JobCard = () => {
    const [expanded, setExpanded] = useState(false);
    const [imageFullscreen, setImageFullscreen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setImageFullscreen(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // 画像部分のスワイプ処理
    const handleImageDragEnd = (_: any, info: any) => {
        if (info.offset.y > -50) {
            setImageFullscreen(prev => !prev);
            setExpanded(false);
        }
    };

    // 給与情報部分のスワイプ処理
    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.y < -50) setExpanded(true);
        if (info.offset.y > 50) setExpanded(false);
    };

    return(
        <motion.div
            className="relative w-5/6 max-w-[720px] h-2/3 bg-white shadow-lg rounded-2xl overflow-hidden"
            initial="collapsed"
            animate={expanded ? "expanded" : "collapsed"}
            variants={{
                collapsed: { height: "66%" },
                expanded: { height: "90%" },
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <motion.div
                className="absolute w-full cursor-grab active:cursor-grabbing"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={handleImageDragEnd}
                initial="fullscreen"
                animate={imageFullscreen ? "fullscreen" : expanded ? "expanded" : "collapsed"}
                variants={{
                    collapsed: { height: "60%" },
                    expanded: { height: "20%" },
                    fullscreen: { height: "100%" },
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
                <Image
                    src="/sample.png"
                    alt="Job Matching"
                    width={100}
                    height={100}
                    className={`object-cover inset-0 absolute w-full ${imageFullscreen ? "my-auto" : ""}`}
                />
                <div className={`absolute h-full w-full bg-black/40 text-white p-4 ${imageFullscreen ? "hidden" : "display"}`}>
                    <div className="flex justify-end text-3xl font-semibold">
                        <FontAwesomeIcon icon={faHeart} className="text-red-400" />
                        <span className="ml-2">15.6K</span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <p className="text-xl font-semibold">市民の命を守る</p>
                        <h1 className="text-4xl font-bold">消防士</h1>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="absolute p-4 bottom-0 w-full bg-white rounded-t-2xl cursor-grab active:cursor-grabbing"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={handleDragEnd}
                initial="hidden"
                animate={imageFullscreen ? "hidden" : expanded ? "expanded" : "collapsed"}
                variants={{
                    collapsed: { height: "40%", opacity: 1, overflowY: "hidden" },
                    expanded: { height: "80%", opacity: 1, overflowY: "scroll" },
                    hidden: { height: "0%", opacity: 0 },
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                style={{ pointerEvents: imageFullscreen ? "none" : "auto" }}
            >
                <div className="w-1/4 bg-zinc-200 h-1 rounded-full m-3 mx-auto"></div>

                <HorizontalStackContainer className="h-40 mb-10">
                    <JobParameter className="mx-auto my-auto"/>
                    <JobParameter className="mx-auto my-auto" />
                    <JobParameter className="mx-auto my-auto" />
                    <JobParameter className="mx-auto my-auto" />
                </HorizontalStackContainer>
                
                <div className={expanded ? "display" : "hidden"}>
                    <JobDetailSection title="業務内容">
                        <p>
                            Webアプリケーションやモバイルアプリの設計・開発・保守を行います。チームでの協働やコードレビュー、新技術の導入なども重要な業務です。
                        </p>
                    </JobDetailSection>

                    <JobDetailSection title="必要スキル">
                        <ul>
                            <Tag color="yellow" text="JavaScript"/>
                            <Tag color="orange" text="React"/>
                            <Tag color="green" text="Node.js"/>
                            <Tag color="purple" text="Python"/>
                            <Tag color="red" text="Git"/>
                            <Tag color="slate" text="SQL"/>
                        </ul>
                    </JobDetailSection>

                    <JobDetailSection title="資格">
                        <ul>
                            <Tag color="green" text="基本情報技術者"/>
                            <Tag color="orange" text="応用技術者試験"/>
                            <Tag color="blue" text="情報処理安全確保支援士"/>
                            <Tag color="purple" text="AWS認定資格"/>
                        </ul>
                    </JobDetailSection>

                    <JobDetailSection title="関連有名企業">
                        <GridContainer minWidth={100}>
                            <CompanyCard name="Google" description="検索・AI" />
                            <CompanyCard name="Microsoft" description="クラウド・AI" />
                            <CompanyCard name="Amazon" description="Eコマース・クラウド" />
                            <CompanyCard name="Apple" description="ハードウェア・ソフトウェア" />
                        </GridContainer>
                    </JobDetailSection>

                    <JobDetailSection title="才能">
                        <ul>
                            <li>論理的思考力と問題解決能力</li>
                            <li>継続的な学習意欲と新技術への適応力</li>
                            <li>チームでの協働やコードレビューの経験</li>
                        </ul>
                    </JobDetailSection>

                    <JobDetailSection title="才能">
                        <ul>
                            <li>論理的思考力と問題解決能力</li>
                            <li>継続的な学習意欲と新技術への適応力</li>
                            <li>チームでの協働やコードレビューの経験</li>
                        </ul>
                    </JobDetailSection>

                    <BaseButton color="slate" className="my-3 !rounded-full w-full">
                        <a href="/job/detail/1/chat"></a>チャットで質問する
                    </BaseButton>
                    
                </div>
            </motion.div>
        </motion.div>
    )
}

export const JobDetailSection = ({title, children}: {title: string, children: React.ReactNode}) => {
    return (
        <div className="my-4">
            <h3>{title}</h3>
            <div className="my-2 text-zinc-500">
                {children}
            </div>
        </div>
    )
}

export const CompanyCard = ({name, description}: {name: string, description: string}) => {
    return (
        <div className="m-1 p-2 text-center bg-zinc-50 border border-zinc-200 rounded-2xl">
            <p className="font-semibold text-slate-900">{name}</p>
            <p className="text-zinc-500">{description}</p>
        </div>
    )
}

export const JobParameter = ({className = ""}: {className?: string}) => {
    return (
        <div>
            <div className={`h-full ${className}`}>
                <svg className="w-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-zinc-200" strokeWidth="2"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-emerald-500" strokeWidth="2" strokeDasharray="100" strokeDashoffset="65" strokeLinecap="round"></circle>
                </svg>
            </div>
            <div className="text-center">
                <span className="text-center text-xl font-bold text-emerald-500">35%</span>
            </div>
        </div>
    )
}