import React, { useEffect, useState } from 'react'
import TasksStore from './store/tasks'
import { COUCHDB_DB_NAME } from './utils/globals'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')

  useEffect(() => {
    const initialStore = async () => {
      if (!TasksStore.isInitialized) {
        TasksStore.setName(COUCHDB_DB_NAME) // to set databasename for model
        await TasksStore.initialize() // to initialize database locally by getting synced
        setTasks([...tasks, ...TasksStore.data])
        setLoading(false)
      }
    }
    initialStore()
  }, [tasks])

  console.log(tasks)

  const handleDelete = async (id) => {
    TasksStore.deleteItem(id)
    setTasks([])
    setLoading(true)
    await TasksStore.deinitialize()
  }

  const handleAdd = async () => {
    if (content) {
      TasksStore.addItem(
        {
          content,
          isDone: false,
          tag: 'New',
        },
        TasksStore.data
      )
      setTasks([])
      setLoading(true)
      await TasksStore.deinitialize()
    }
  }

  return (
    <div className="m-auto max-w-xl w-full overflow-hidden">
      <h1 className="uppercase text-2xl block font-bold py-6 text-gray-400 tracking-widest text-center">
        Task Manager
      </h1>
      <div className="flex items-center justify-between relative border-0">
        <input
          placeholder="Search task ..."
          type="text"
          className="p-4 border-t-4 border-blue-700 rounded bg-gray-900 text-primary w-full shadow-inner outline-none"
        />
      </div>
      <div className="flex items-center justify-center my-4">
        <input type="checkbox" className="mr-2" />{' '}
        <span>Hide Completed Task</span>
      </div>
      <ul className="list-none">
        {loading && <h1 className="text-center text-2xl">Loading ...</h1>}
        {tasks &&
          tasks.map((val, key) => {
            return (
              <div className="flex flex-row justify-center" key={key}>
                <li className="active todo-item w-full items-center">
                  <div className="text-base">{val.content}</div>
                  <span className="bg-yellow-400 text-black rounded px-1 ml-2 button-small font-smaller">
                    {`#${val.tag}`}
                  </span>
                </li>
                <div className="flex items-center">
                  <button className="bg-blue-800 button-small rounded p-2 mr-2 focus:outline-none">
                    Done
                  </button>
                  <button className="bg-green-800 button-small rounded p-2 mr-2 focus:outline-none">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(val._id)}
                    className="bg-red-800 button-small rounded p-2 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
      </ul>
      <div className="flex items-center justify-between relative border-0 mt-2">
        <input
          placeholder="Add new item..."
          type="text"
          className="p-4 border-t-4 border-blue-700 rounded bg-gray-900 text-primary w-full shadow-inner outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={() => handleAdd()}
          className="text-blue-400 hover:text-blue-300 bg-gray-900 font-semibold py-2 px-4 absolute right-0 mr-2 focus:outline-none"
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default App
