export const MentorDashboardCard = ({title, children}: {title: string, children: React.ReactNode}) => {

    return (
        <div className="bg-white p-8">
            <p className="text-zinc-500 my-2">{title}</p>
            <h1>{children}</h1>
        </div>
    )
}