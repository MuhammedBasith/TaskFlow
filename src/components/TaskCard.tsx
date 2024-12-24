import { useState } from "react"
import TrashIcon from "../icons/TrashIcon"
import { type Id, type Task } from "../types"

interface Props {
    task: Task
    deleteTask: (id: Id) => void
}


function TaskCard({ task, deleteTask }: Props) {

    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)
    const [editMode, setEditMode] = useState<boolean>(false)

    const toggleEditMode = () => {
        setEditMode((prev) => !prev)
        setMouseIsOver(false)
    }

    if(editMode){
        return <>jell</>
    }

    return (
        <div
            onClick={toggleEditMode}
            onMouseEnter={() => {
                setMouseIsOver(true)
            }}
            onMouseLeave={() => {
                setMouseIsOver(false)
            }}
            className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose500 cursor-grab relative">
            {task.content}

            {mouseIsOver && <button
                onClick={() => {
                    deleteTask(task.id)
                }}
                className="stroke-white absolute right-4 top-1/2-translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-50 hover:opacity-100">
                <TrashIcon />
            </button>}
        </div>
    )
}

export default TaskCard