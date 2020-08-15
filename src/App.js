import React, { useEffect, useState } from 'react'
import TasksStore from './store/tasks'
import { COUCHDB_DB_NAME } from './utils/globals'
import { useSnackbar } from 'notistack'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [filters, setFilters] = useState({
    searchText: '',
    hideCompleted: false,
  })
  const [formEdit, setFormEdit] = useState({
    content: '',
    tag: '',
  })
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const initialStore = async () => {
      if (!TasksStore.isInitialized) {
        TasksStore.setName(COUCHDB_DB_NAME) // to set databasename for model
        await TasksStore.initialize() // to initialize database locally by getting synced
        const dataTasks = []
        for (const val of TasksStore.data) {
          dataTasks.push({
            ...val,
            isEdit: false,
          })
        }
        setTasks([...tasks, ...dataTasks])
        setLoading(false)
      }
    }
    initialStore()
  }, [tasks])

  const handleDelete = async (id) => {
    try {
      TasksStore.deleteItem(id)
      setTasks([])
      setLoading(true)
      await TasksStore.deinitialize()
      enqueueSnackbar('Task Success Deleted', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(JSON.stringify(e), { variant: 'error' })
    }
  }

  const handleAdd = async () => {
    try {
      if (content) {
        TasksStore.addItem(
          {
            content,
            isDone: false,
            tag: 'New',
          },
          TasksStore.data
        )
        await TasksStore.deinitialize()
        setTasks([])
        setLoading(true)
      }
      enqueueSnackbar('Task Success Added', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(JSON.stringify(e), { variant: 'error' })
    }
  }

  const handleSync = async () => {
    try {
      setTasks([])
      setLoading(true)
      await TasksStore.deinitialize()
      enqueueSnackbar('Sync Data Successed', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(JSON.stringify(e), { variant: 'error' })
    }
  }

  const handleDone = async (id) => {
    try {
      TasksStore.editItem(id, { isDone: true })
      await TasksStore.deinitialize()
      setTasks([])
      setLoading(true)
      enqueueSnackbar('Task Completed', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(JSON.stringify(e), { variant: 'error' })
    }
  }

  const handleEdit = (id) => {
    const findTask = tasks.find((task) => task._id === id)
    findTask.isEdit = !findTask.isEdit
    setFormEdit({
      content: findTask.content,
      tag: findTask.tag,
    })
    setTasks([...tasks])
  }

  const saveEdit = async (id) => {
    try {
      await TasksStore.editItem(id, formEdit)
      await TasksStore.deinitialize()
      setTasks([])
      setLoading(true)
      enqueueSnackbar('Task Success Edited', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(JSON.stringify(e), { variant: 'error' })
    }
  }

  const filteredTask = tasks.filter(function (task) {
    const searchTextMatch = task.content
      .toLowerCase()
      .includes(filters.searchText.toLowerCase())
    const hideCompletedMatch = !filters.hideCompleted || !task.isDone

    return searchTextMatch && hideCompletedMatch
  })

  const handleUpdateRemote = () => {
    TasksStore.upload()
    enqueueSnackbar('Send Update Data Successed', { variant: 'success' })
  }

  return (
    <div className="m-auto max-w-xl w-full overflow-hidden">
      <h1 className="uppercase text-2xl block font-bold py-6 text-gray-400 tracking-widest text-center">
        Task Manager
      </h1>
      <div className="flex items-center relative border-0 my-1">
        <button
          onClick={() => {
            handleSync()
          }}
          className="button bg-blue-800 p-2 rounded mr-1"
        >
          Sync Data
        </button>
        <button
          className="button bg-blue-800 p-2 rounded "
          onClick={() => {
            handleUpdateRemote()
          }}
        >
          Send Update
        </button>
      </div>
      <div className="flex items-center justify-between relative border-0">
        <input
          placeholder="Search task ..."
          type="text"
          value={filters.searchText}
          onChange={(e) =>
            setFilters({ ...filters, searchText: e.target.value })
          }
          className="p-4 border-t-4 border-blue-700 rounded bg-gray-900 text-primary w-full shadow-inner outline-none"
        />
      </div>
      <div className="flex items-center justify-center my-4 text-gray-400">
        <input
          type="checkbox"
          className="mr-2"
          onChange={() =>
            setFilters({
              ...filters,
              hideCompleted: !filters.hideCompleted,
            })
          }
        />{' '}
        <span>Hide Completed Task</span>
      </div>
      <ul className="list-none">
        {loading && <h1 className="text-center text-base">Loading ...</h1>}
        {filteredTask &&
          filteredTask.map((val, key) => {
            return (
              <div className="flex flex-row justify-center" key={key}>
                <li
                  className={`active todo-item w-full items-center ${
                    val.isDone ? 'border-green-500' : ''
                  }`}
                >
                  {val.isEdit ? (
                    <input
                      placeholder="Search task ..."
                      type="text"
                      value={formEdit.content}
                      onChange={(e) =>
                        setFormEdit({
                          ...formEdit,
                          content: e.target.value,
                        })
                      }
                      className="p-2 rounded bg-white text-gray-900 text-primary w-full shadow-inner outline-none mr-1"
                    />
                  ) : (
                    <div className="text-base text-gray-400">{val.content}</div>
                  )}
                  {val.isEdit ? (
                    <input
                      placeholder="Search task ..."
                      type="text"
                      value={formEdit.tag}
                      onChange={(e) =>
                        setFormEdit({
                          ...formEdit,
                          tag: e.target.value,
                        })
                      }
                      className="p-2 rounded bg-white text-gray-900 text-primary w-full shadow-inner outline-none"
                    />
                  ) : (
                    <span className="bg-yellow-400 text-black rounded px-1 ml-2 button-small font-smaller">
                      {`#${val.tag}`}
                    </span>
                  )}
                </li>
                <div className="flex items-center">
                  {!val.isDone && !val.isEdit && (
                    <>
                      <button
                        onClick={() => handleDone(val._id)}
                        className="bg-blue-800 button-small rounded p-2 mr-2 focus:outline-none"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => handleEdit(val._id)}
                        className="bg-green-800 button-small rounded p-2 mr-2 focus:outline-none"
                      >
                        Edit
                      </button>
                    </>
                  )}
                  {val.isEdit ? (
                    <>
                      <button
                        onClick={() => saveEdit(val._id)}
                        className="bg-blue-800 button-small rounded p-2 mr-2 focus:outline-none"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleEdit(val._id)}
                        className="bg-gray-900 button-small rounded p-2 focus:outline-none"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDelete(val._id)}
                      className="bg-red-800 button-small rounded p-2 focus:outline-none"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        {filteredTask.length === 0 && (
          <li className="text-gray-400 text-center text-base">
            Add your task to get started
          </li>
        )}
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
