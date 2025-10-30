import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type GroupCardProps = {
    id: string;
    name: string;
    memberCount: number;
}

export const GroupCard = ({ id, name, memberCount }: GroupCardProps) => {
    return (
        <Link href={`/mentor/dreamer/group/detail/${id}`}>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 hover:bg-zinc-100 cursor-pointer">
                <div className="flex items-center gap-5">
                    <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-zinc-500" />
                    <div>
                        <h3 className="font-bold text-base text-slate-800">{name}</h3>
                        <p className="text-sm text-zinc-500">{memberCount}名</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}