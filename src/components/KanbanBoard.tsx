import { useMemo, useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import { type Id, type Column, type Task } from "../types"
import generateId from "../utils/generateId"
import ColumnContainer from "./ColumnContainer"
import { DndContext, type DragEndEvent, type DragOverEvent, DragOverlay, type DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import TaskCard from "./TaskCard"

function KanbanBoard() {

    const [columns, setColumns] = useState<Column[]>([])
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns])
    const [activeColumn, setActiveColumn] = useState<Column | null>(null)
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3
            }
        })
    )


    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`
        }

        setTasks([...tasks, newTask])
    }

    function deleteTask(id: Id) {
        const newTasks = tasks.filter((task) => task.id !== id)
        setTasks(newTasks)
    }

    function updateTask(id: Id, content: string) {
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task;

            return { ...task, content }
        })

        setTasks(newTasks)
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter((column) => (column.id !== id))
        setColumns(filteredColumns)

        const newTasks = tasks.filter((t) => t.columnId !== id)
        setTasks(newTasks)
    }

    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }
        setColumns([...columns, columnToAdd])
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current?.column)
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current?.task)
            return;
        }

    }

    function onDragEnd(event: DragEndEvent) {

        setActiveColumn(null)
        setActiveTask(null)


        const { active, over } = event

        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id

        if (activeColumnId === overColumnId) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex(column => column.id === activeColumnId)
            const overColumnIndex = columns.findIndex(column => column.id === overColumnId)

            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }

    function onDragOver(event: DragOverEvent) {

        const { active, over } = event

        if (!over) return;

        const activeId = active.id;
        const overId = over.id

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task"
        const isOverATask= over.data.current?.type === "Task"

        if(!isActiveTask) return;

        if(isActiveTask && isOverATask){
            setTasks((task) => {
                const activeIndex = task.findIndex((t) => t.id === activeId)
                const overIndex = task.findIndex((t) => t.id === overId)

                if(task[activeIndex].columnId !== task[overIndex].columnId){
                    task[activeIndex].columnId = task[overIndex].columnId
                }

                return arrayMove(task, activeIndex, overIndex)
            })
        }

        const isOverAColumn = over.data.current?.type === "Column"

        if(isActiveTask && isOverAColumn){

            setTasks((task) => {
                const activeIndex = task.findIndex((t) => t.id === activeId)

                task[activeIndex].columnId = overId

                return arrayMove(task, activeIndex, activeIndex)
            })
            
        }



    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map((column) => {
            if (column.id !== id) return column;

            return { ...column, title }
        })

        setColumns(newColumns)
    }

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-auto px-[40px]">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="m-auto flex gap-5">
                    <div className="flex gap-5">
                        <SortableContext items={columnsId}>
                            {columns.map((column) => (
                                <ColumnContainer key={column.id} column={column} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} tasks={tasks.filter((task) => task.columnId === column.id)} deleteTask={deleteTask} updateTask={updateTask} />
                            ))}
                        </SortableContext>
                    </div>
                    <button className="flex gap-2 h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2" onClick={() => { createNewColumn() }}>
                        <PlusIcon />
                        Add Column
                    </button>
                </div>

                {createPortal(<DragOverlay>
                    {activeColumn && (
                        <ColumnContainer
                            column={activeColumn}
                            deleteColumn={deleteColumn}
                            updateColumn={updateColumn}
                            createTask={createTask}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                        />
                    )}
                    {
                        activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />
                    }
                </DragOverlay>,
                    document.body)}
            </DndContext>
        </div>
    )
}

export default KanbanBoard