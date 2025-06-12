import { PagaeTitleType, SectionTitleType, TextContentsType } from "@/types/ui/Atoms"
import { HorizontalStackContainer } from "../molecules/Container"

export const PageTitle = (props: PagaeTitleType) => {
    return(
        <HorizontalStackContainer space="2" className={`my-6 ${props.className}`}>
            <div className="w-6 h-6 bg-black text-white flex items-center justify-center w-fu">
                {props.number}
            </div>
            <h3>{props.title}</h3>
        </HorizontalStackContainer>
    )
}

export const SectionTitle = (props: SectionTitleType) => {
    return(
        <HorizontalStackContainer space="2" className={`my-4 ${props.className}`}>
            <div className="w-7 h-7 bg-blue-700 text-white flex items-center justify-center rounded-full">
                {props.number}
            </div>
            <h4>{props.title}</h4>
        </HorizontalStackContainer>
    )
}

// TOOD: LaTexをコンパイルして貼り付けるようにする
export const TextContents = (props: TextContentsType) => {
    return(
        <p className={`font-semibold ${props.clasName}`}>
            {props.text}
        </p>
    )
}