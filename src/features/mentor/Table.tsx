import { HorizontalStackContainer, GridContainer } from "@/components/ui/molecules/Container"
import { BaseInputText } from "@/components/ui/atoms/Input"
import { IconButton } from "@/components/ui/atoms/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tag } from "@/components/ui/atoms/Text"

import { faFilter, faPlus, faUser } from "@fortawesome/free-solid-svg-icons"

export const TableButton = () => {
    return(
        <>
            <HorizontalStackContainer className="my-4">
                <BaseInputText placeholder="Dreamer名で検索" className="w-full"/>
                <IconButton icon={faFilter} className="w-40">
                    フィルタ
                </IconButton>
                <IconButton icon={faPlus} color="blue" className="w-50">
                    Dreamer追加
                </IconButton>
            </HorizontalStackContainer>
        </>
    )
}

export const TableHeader = ({titleList}: {titleList: string[]}) => {
    return (
        <thead className="bg-zinc-200">
            <tr>
                <>
                    {titleList.map((title) => (
                        <th key={title} className="text-left p-2">
                            {title}
                        </th>
                    ))}
                </>
            </tr>
        </thead>
    );
}

export const DreamerListItem = ({name, student_num, group, login_at, created_at}: {name: string, student_num: string, group: {label: string, id: string}[], login_at: string, created_at: string}) => {
    return (
        <tr className="bg-white hover:bg-zinc-100 cursor-pointer">
            <td className="p-4">
                <FontAwesomeIcon icon={faUser} className="h-10 aspect-square mr-2 flex justify-center items-center"/>
                {name}
            </td>
            <td className="p-2">{student_num}</td>
            <td className="p-2">
                <GridContainer minWidth={30}>
                    {group.map((g) => (
                        <Tag key={g.id} color="blue" text={g.label}/>
                    ))}
                </GridContainer>
            </td>
            <td className="p-2">
                {login_at}
            </td>
            <td className="p-2">
                {created_at}
            </td>
        </tr>
    )
}
