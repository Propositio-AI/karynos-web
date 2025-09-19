type BaseContainerProps = {
    children?: React.ReactNode
    className?: string
}
export const CenterContainer = ({children, className=""}: BaseContainerProps) => {
    return(
        <div className={`flex justify-center items-center ${className}`}>
            {children}
        </div>
    )
}


export const PageContainer = ({children, className=""}: BaseContainerProps) => {
    return(
        <div className={`m-2 text-center ${className}`}>
            {children}
        </div>
    )
}

type spaceNumberType = 0 | 1 | 2 | 4 | 8
const spaceMap: Record<spaceNumberType, string> = {
    0: 'space-y-0',
    1: 'space-y-1',
    2: 'space-y-2',
    4: 'space-y-4',
    8: 'space-y-8',
}
type StackContainerProps = {
    children?: React.ReactNode
    className?: string
    space?: spaceNumberType
    onClick?: () => void
}
export const VerticalStackContainer = ({children, className="", space=2}: StackContainerProps) => {    


    return(
        <div className={`${spaceMap[space]} ${className}`}>
            {children}
        </div>
    )
}

export const HorizontalStackContainer = ({children, className="", space=2, onClick}: StackContainerProps) => {    
    const spaceMap: Record<number, string> = {
        0: 'space-x-0',
        1: 'space-x-1',
        2: 'space-x-2',
        4: 'space-x-4',
        8: 'space-x-8',
    }

    return(
        <div className={`flex items-center ${spaceMap[space]} ${className}`} onClick={onClick}>
            {children}
        </div>
    )
}

type GridContainerType = {
    children?: React.ReactNode
    minWidth?: number
    className?: string
}

export const GridContainer = ({children, minWidth=300, className=""}: GridContainerType) => {
    const gridStyle = {
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
    };

    return (
        <div className={`grid gap-4 p-4 ${className}`} style={gridStyle}>
            {children}
        </div>
    );
};