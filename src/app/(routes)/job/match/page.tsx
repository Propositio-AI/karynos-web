"use client"

import { CenterContainer, GridContainer, VerticalStackContainer } from "@/components/ui/molecules/Container"
import { NavBar } from "@/components/ui/templates/NavBar"
import { Tag } from "@/components/ui/atoms/Text"
import { BaseButton } from "@/components/ui/atoms/Button"
import Image from "next/image"
import { motion } from "framer-motion"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

const JobMatching = () => {
    const [expanded, setExpanded] = useState(false);
    const [imageFullscreen, setImageFullscreen] = useState(false);

    // 画像部分のスワイプ処理
    const handleImageDragEnd = (_: any, info: any) => {
        if (info.offset.y < -50) {
            setImageFullscreen(true);
            setExpanded(false);
        }
        if (info.offset.y > 50) {
            setImageFullscreen(false);
        }
    };

    // 給与情報部分のスワイプ処理
    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.y < -50) setExpanded(true);
        if (info.offset.y > 50) setExpanded(false);
    };
    return( 
        <NavBar match={true} explore={false} home={false} map={false} setting={false}>
            <CenterContainer className="w-full h-full">
                <motion.div
                    className="relative w-5/6 max-w-[720px] h-2/3 bg-white shadow-lg rounded-2xl overflow-hidden"
                    animate={expanded ? "expanded" : "collapsed"}
                    variants={{
                        collapsed: { height: "66%" },
                        expanded: { height: "90%" },
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    {/* 背景画像部分（スワイプ可能） */}
                    <motion.div
                        className="absolute w-full cursor-grab active:cursor-grabbing"
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        onDragEnd={handleImageDragEnd}
                        animate={imageFullscreen ? "fullscreen" : expanded ? "expanded" : "collapsed"}
                        variants={{
                            collapsed: { height: "60%" },
                            expanded: { height: "20%" },
                            fullscreen: { height: "100%" },
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    >
                        <Image
                            src="/sample.png"
                            alt="Job Matching"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute h-full w-full bg-black/40 text-white p-4">
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

                    {/* 給与情報部分（スワイプ対象） */}
                    <motion.div
                        className="absolute p-4 bottom-0 w-full bg-white rounded-t-2xl cursor-grab active:cursor-grabbing"
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        onDragEnd={handleDragEnd}
                        animate={imageFullscreen ? "hidden" : expanded ? "expanded" : "collapsed"}
                        variants={{
                            collapsed: { height: "40%", opacity: 1, overflowY: "hidden" },
                            expanded: { height: "80%", opacity: 1, overflowY: "scroll" },
                            hidden: { height: "0%", opacity: 0 },
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 18 }}
                        style={{ pointerEvents: imageFullscreen ? "none" : "auto" }}
                    >
                        {/* ドラッグバー */}
                        <div className="w-1/4 bg-zinc-200 h-1 rounded-full m-3 mx-auto"></div>

                        {/* 情報グリッド */}
                        <GridContainer minWidth={100} className="h-40 mb-10">
                            {["Salary", "Age", "Holiday", "Work time"].map((label, i) => (
                                <div key={i} className="my-auto mx-auto text-center ">
                                    <h1 className="text-lg font-semibold">620万</h1>
                                    <p className="text-zinc-500 font-medium">{label}</p>
                                </div>
                            ))}
                        </GridContainer>
                        
                        {/* 詳細情報 */}
                        <div className={expanded ? "display" : "hidden"}>
                            <div className="my-4">
                                <h3>業務内容</h3>
                                <p className="my-2 text-zinc-500">
                                    Webアプリケーションやモバイルアプリの設計・開発・保守を行います。チームでの協働やコードレビュー、新技術の導入なども重要な業務です。
                                </p>
                            </div>

                            <div className="my-4">
                                <h3>必要スキル</h3>
                                <ul className="my-2">
                                    <Tag color="yellow" text="JavaScript"/>
                                    <Tag color="orange" text="React"/>
                                    <Tag color="green" text="Node.js"/>
                                    <Tag color="purple" text="Python"/>
                                    <Tag color="red" text="Git"/>
                                    <Tag color="slate" text="SQL"/>
                                </ul>
                            </div>

                            <div className="my-4">
                                <h3>資格</h3>
                                <ul className="my-2">
                                    <Tag color="green" text="基本情報技術者"/>
                                    <Tag color="orange" text="応用技術者試験"/>
                                    <Tag color="blue" text="情報処理安全確保支援士"/>
                                    <Tag color="purple" text="AWS認定資格"/>
                                </ul>
                            </div>

                            <div className="my-4">
                                <h3>関連有名企業</h3>
                                <GridContainer minWidth={100} className="my-2">
                                    {/* 会社カード */}
                                    <div className="m-1 p-2 text-center bg-zinc-50 border border-zinc-200 rounded-2xl">
                                        <p className="font-semibold">Google</p>
                                        <p>検索・AI</p>
                                    </div>
                                    <div className="m-1 p-2 text-center bg-zinc-50 border border-zinc-200 rounded-2xl">
                                        <p className="font-semibold">Google</p>
                                        <p>検索・AI</p>
                                    </div>
                                    <div className="m-1 p-2 text-center bg-zinc-50 border border-zinc-200 rounded-2xl">
                                        <p className="font-semibold">Google</p>
                                        <p>検索・AI</p>
                                    </div>
                                </GridContainer>
                            </div>

                             <div className="my-4">
                                <h3>才能</h3>
                                <ul className="my-2 text-zinc-500">
                                    <li>論理的思考力と問題解決能力</li>
                                    <li>継続的な学習意欲と新技術への適応力</li>
                                    <li>チームでの協働やコードレビューの経験</li>
                                </ul>
                            </div>

                            <BaseButton color="slate" className="my-3 !rounded-full w-full">
                                <a href="/job/detail/1/chat"></a>チャットで質問する
                            </BaseButton>
                            
                        </div>
                    </motion.div>
                </motion.div>
            </CenterContainer>
        </NavBar>
   )
}

export default JobMatching