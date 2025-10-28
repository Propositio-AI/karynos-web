type TagColor = "slate" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

export const Tag = ({text, color}: {text: string, color: TagColor}) => {
    const ColorMap: Record<TagColor, {bg: string, hover: string, text: string}> = {
        slate: {bg: "bg-slate-100", hover: "bg-slate-200", text: "text-slate-800"},
        red: {bg: "bg-red-100", hover: "bg-red-200", text: "text-red-800"},
        orange: {bg: "bg-orange-100", hover: "bg-orange-200", text: "text-orange-800"},
        yellow: {bg: "bg-yellow-100", hover: "bg-yellow-200", text: "text-yellow-800"},
        green: {bg: "bg-green-100", hover: "bg-green-200", text: "text-green-800"},
        blue: {bg: "bg-blue-100", hover: "bg-blue-200", text: "text-blue-800"},
        purple: {bg: "bg-purple-100", hover: "bg-purple-200", text: "text-purple-800"},
    }

    return (
        <div className={`inline-flex px-2.5 py-1 rounded-full border ${ColorMap[color].bg} hover:${ColorMap[color].hover} ${ColorMap[color].text} cursor-pointer `}>
            <span className="text-xs font-medium">{text}</span>
        </div>
    );
}