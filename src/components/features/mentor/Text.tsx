export const ProfileText = ({title, text}: {title: string, text: string}) => {
    return(
        <>
            <p className="text-sm text-zinc-500">{title}</p>
            <p className="text-base font-semibold text-slate-800">{text}</p>
        </>
    )
}