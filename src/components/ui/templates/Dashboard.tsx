import { StudyActivityType } from "@/types/ui/Templates"

export const StudyActivity = (props: StudyActivityType) => {
    const calcColor = (activity: number) => {
       switch (Math.round(activity * 10)) {
            case 1: return "bg-blue-100";
            case 3: return "bg-blue-300";
            case 5: return "bg-blue-500";
            case 7: return "bg-blue-700";
            case 9: return "bg-blue-900";
            default: return "bg-blue-50";
        }
    }

    return(
        <div>
            <h4 className="text-gray-400">アクティビティ</h4>

            <table className="w-full text-center table-auto border-separate border-spacing-2">
                <thead>
                    <tr>
                        <td><h4>月</h4></td>
                        <td><h4>火</h4></td>
                        <td><h4>水</h4></td>
                        <td><h4>木</h4></td>
                        <td><h4>金</h4></td>
                        <td><h4>土</h4></td>
                        <td><h4>日</h4></td>
                    </tr>
                </thead>
                <tbody>
                    {props.activity.map((row, index_1) => (
                        <tr key={index_1}>
                            {row.map((value, index_2) => (
                                <td className={`py-4 m-1 p-2 ${calcColor(value)} rounded`} key={index_2}></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}