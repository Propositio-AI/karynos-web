"use client"

import { NavBar } from "@/components/ui/templates/NavBar"
import { Tag } from "@/components/ui/atoms/Text"

export default function Home() {
    return(
        <div className="m-5">
            <NavBar match={true} explore={false} home={false} map={false} setting={false} />
            <Tag text="3年A組" color="green"/>
        </div>
    )
}
