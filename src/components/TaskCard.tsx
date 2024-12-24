import { useState } from "react"
import TrashIcon from "../icons/TrashIcon"
import { type Task } from "../types"

interface Props {
    task: Task
}


function TaskCard({ task }: Props) {

    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)


    return (
        <div className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose500 cursor-grab relative">
            {task.content}
            <button className="stroke-white absolute right-4 top-1/2-translate-y-1/2 bg-columnBackgroundColor p-2 rounded">
                <TrashIcon />
            </button>
        </div>
    )
}

export default TaskCard