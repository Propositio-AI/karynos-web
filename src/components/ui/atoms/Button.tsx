import { BaseButtonProps, IconButtonProps } from "@/types/ui/Atoms"
import { HorizontalStackContainer } from "../molecules/Container"

export const BaseButton = (props: BaseButtonProps) => {
    const colorMap: Record<string, string> = {
        "black": "bg-black",
        "white": "bg-white",
        "transparent": "",
    }
    const hoverColorMap: Record<string, string> = {
        "black": "hover:bg-gray-900",
        "white": "hover:bg-gray-500",
        "transparent": "hover:bg-gray-100"
    }
    const textColorMap: Record<string, string> = {
        "black": "text-white",
        "white": "text-blue-500",
        "transparent": "text-black"
    }

    const color = colorMap[props.color] ?? colorMap["black"]
    const hoverColor = hoverColorMap[props.color] ?? hoverColorMap["black"]
    const textColor = textColorMap[props.color] ?? textColorMap["black"]

    return(
        <button className={`p-2 ${color} ${textColor} rounded-lg ${hoverColor} hover:cursor-pointer ${props.className}`}>
            {props.children}
        </button>
    )
}

export const IconButton = (props: IconButtonProps) => {
    return(
        <BaseButton {...props}>
            <HorizontalStackContainer space="2">
                <span className="h-8 aspect-square">
                    {props.icon}
                </span>
                {props.children}
            </HorizontalStackContainer>
        </BaseButton>
    )
}