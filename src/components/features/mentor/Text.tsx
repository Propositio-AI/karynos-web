export const ProfileText = ({title, text}: {title: string, text: string}) => {
    return(
        <>
            <p className="text-sm text-muted">{title}</p>
            <p className="text-base font-semibold text-ink">{text}</p>
        </>
    )
}