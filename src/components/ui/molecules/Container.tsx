import { BaseContainerType, StackContainerType, spaceNumberType, GridContainerType } from "@/types/ui/molecules/Container"
import { ChatMessage } from "@/features/chat/Text"

/**

CenterContainer コンポーネント 

Props:
- children: コンテナ子要素
- className: 追加のCSS

|-----------------------|
|                       |
|    CenterContainer    |
|                       |
|-----------------------|

**/
export const CenterContainer = ({children, className=""}: BaseContainerType) => {
    return(
        <div className={`flex justify-center items-center ${className}`}>
            {children}
        </div>
    )
}

/**

VerticalStackContainer コンポーネント

Props:
- children: コンテナ子要素
- className: 追加のCSS
- space: 子要素間のスペース (デフォルト: 2)

|-----------------------|
|        Stack1         |
|        Stack2         |
|        Stack3         |
|-----------------------|

**/
export const VerticalStackContainer = ({children, className="", space=2}: StackContainerType) => {    
    const spaceMap: Record<spaceNumberType, string> = {
        0: 'space-y-0',
        1: 'space-y-1',
        2: 'space-y-2',
        4: 'space-y-4',
        8: 'space-y-8',
        12: 'space-y-12',
        16: 'space-y-16',
    }
    
    return(
        <div className={`flex flex-col ${spaceMap[space]} ${className}`}>
            {children}
        </div>
    )
}

/**

HorizontalStackContainer コンポーネント

props:
- children: コンテナ子要素
- className: 追加のCSS
- space: 子要素間のスペース (デフォルト: 2)
- onClick: クリック時のコールバック関数

|-------------------|
|    s    s    s    |
|    t    t    t    |
|    a    a    a    |
|    c    c    c    |
|    k    k    k    |
|    1    2    3    |
|-------------------|

**/
export const HorizontalStackContainer = ({children, className="", space=2, onClick}: StackContainerType) => {    
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

/**

GridContainer コンポーネント

Props:
- children: コンテナ子要素
- minWidth: 各グリッドアイテムの最小幅 (デフォルト: 300)
- className: 追加のCSS

**/
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
