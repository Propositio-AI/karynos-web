export const SimpleAnimatePing = () => {
    return(
        <div className="flex justify-center" aria-label="読み込み中">
            <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
            <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full mx-4"></div>
            <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
        </div>
    )
}

export const GeneratingPing = () => {
    return(
        <div className="flex items-center">
            <div className="animate-ping h-2 w-2 bg-green-600 rounded-full"></div>
        </div>
    )
}