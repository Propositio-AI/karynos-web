import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export const GroupCard = ({ id, name, memberCount }: {id: string, name: string, memberCount: number}) => {
    return (
        <Link href={`/mentor/dreamer/group/detail/${id}`}>
            <div className="bg-canvas border border-line rounded-(--radius-md) p-5 hover:bg-line/40 cursor-pointer">
                <div className="flex items-center gap-5">
                    <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-muted" />
                    <div>
                        <h3 className="font-bold text-base text-ink">{name}</h3>
                        <p className="text-sm text-muted">{memberCount}名</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}