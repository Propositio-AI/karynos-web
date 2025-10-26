"use client"

import { SimpleModal } from "@/components/ui/molecules/Modal";

export default function Home() {
    return(
        <div className="m-5">
            <SimpleModal isOpen={true} setIsOpen={() => {}} title="This is Modal Title">
                <h2>Stack 1</h2>
                <h2>Stack 2</h2>
                <h2>Stack 3</h2>
            </SimpleModal>
        </div>
    )
}
