import { BaseContainerProps, StackContainerProps } from "@/types/ui/Molecules";

export const CenterContainer = (props: BaseContainerProps) => {
    return(
        <div className={`flex justify-center items-center ${props.className}`}>
            {props.children}
        </div>
    )
}

export const PageContainer = (props: BaseContainerProps) => {
    return(
        <div className={`m-2 text-center ${props.className}`}>
            {props.children}
        </div>
    )
}

export const VerticalStackContainer = (props: StackContainerProps) => {    
    const spaceMap: Record<number, string> = {
        0: 'space-y-0',
        1: 'space-y-1',
        2: 'space-y-2',
        4: 'space-y-4',
        8: 'space-y-8',
    }

    const space = spaceMap[props.space] ?? ""

    return(
        <div className={`${space} ${props.className}`}>
            {props.children}
        </div>
    )
}

export const HorizontalStackContainer = (props: StackContainerProps) => {    
    const spaceMap: Record<number, string> = {
        0: 'space-x-0',
        1: 'space-x-1',
        2: 'space-x-2',
        4: 'space-x-4',
        8: 'space-x-8',
    }

    const space = spaceMap[props.space] ?? ""

    return(
        <div className={`flex items-center ${space} ${props.className}`}>
            {props.children}
        </div>
    )
}