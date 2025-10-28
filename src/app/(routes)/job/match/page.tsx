"use client"

import { CenterContainer, GridContainer, VerticalStackContainer } from "@/components/ui/molecules/Container"
import { NavBar } from "@/components/ui/templates/NavBar"
import Image from "next/image"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"

const JobMatching = () => {

    return( 
        <NavBar match={true} explore={false} home={false} map={false} setting={false}>
            <CenterContainer className="w-full h-full">
                <VerticalStackContainer className="relative w-5/6 max-w-180 h-2/3 mx-3 shadow-lg rounded-2xl">
                    <Image src="/sample.png" alt="Job Matching" width={100} height={100} className="absolute w-full h-full aspect-square" />
                    <div className="absolute h-3/5 p-4 w-full bg-black/50 text-white">
                        <div className="relative h-full"> 
                            <div className="text-end text-3xl font-semibold">
                                <FontAwesomeIcon icon={faHeart}  className="text-red-400"/>
                                15.6K
                            </div>

                            <div className="absolute bottom-0 left-0 text-end w-full">
                                <p className="text-xl font-semibold">市民の命を守る</p>
                                <h1 className="text-4xl font-bold">消防士</h1>
                            </div>
                        </div>
                    </div>
                    <div className="absolute h-2/5 w-full bottom-0 z-50 bg-white">
                        <div className="w-1/4 bg-zinc-200 h-2 rounded-full m-3 mx-auto"></div>
                        <GridContainer minWidth={100} className="text-center h-10/12">
                            <div className="my-auto">
                                <h1>620万</h1>
                                <p className="text-zinc-500 font-medium">Salary</p> 
                            </div>
                            <div className="my-auto">
                                <h1>620万</h1>
                                <p className="text-zinc-500 font-medium">Salary</p> 
                            </div>
                            <div className="my-auto">
                                <h1>620万</h1>
                                <p className="text-zinc-500 font-medium">Salary</p> 
                            </div>
                            <div className="my-auto">
                                <h1>620万</h1>
                                <p className="text-zinc-500 font-medium">Salary</p> 
                            </div>
                        </GridContainer>
                    </div>
                </VerticalStackContainer>
            </CenterContainer>
        </NavBar>
   )
}

export default JobMatching