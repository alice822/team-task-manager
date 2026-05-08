import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

const STATUSES = ['todo', 'in_progress', 'done']
const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }
const STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
}
const PRIORITY_COLORS = {
  low: 'bg-blue-50 text-blue-600',
  medium: 'bg-yellow-50 text-yellow-600',
  high: 'bg-red-50 text-red-600',
}

const Board = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', status: 'todo',
    due_date: '', assigned_to: '', priority: 'medium'
  })

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/?project_id=${id}`)
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const res = await API.get(`/projects/${id}/members`)
      setMembers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchMembers()
  }, [id])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await API.post('/tasks/', {
        ...form,
        project_id: parseInt(id),
        assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null
      })
      setForm({ title: '', description: '', status: 'todo', due_date: '', assigned_to: '', priority: 'medium' })
      setShowModal(false)
      fetchTasks()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task')
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus })
      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await API.delete(`/tasks/${taskId}`)
      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Project Board</h1>
            <p className="text-gray-500 text-sm">Kanban view of all tasks</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Add Task
          </button>
        </div>

        {loading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {STATUSES.map((status) => (
              <div key={status} className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700">
                    {STATUS_LABELS[status]}
                  </h2>
                  <span className="bg-white text-gray-500 text-xs px-2 py-0.5 rounded-full border border-gray-200">
                    {tasksByStatus(status).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tasksByStatus(status).map((task) => (
                    <div key={task.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition">
                      
                      {/* Priority badge */}
                      {task.priority && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}>
                          {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                        </span>
                      )}

                      <h3 className="text-sm font-medium text-gray-800 mt-2 mb-1">{task.title}</h3>
                      
                      {task.description && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
                      )}

                      {task.due_date && (
                        <p className="text-xs text-gray-400 mb-2">
                          📅 {new Date(task.due_date).toLocaleDateString()}
                        </p>
                      )}

                      {/* Assigned user */}
                      {task.assigned_user && (
                        <div className="flex items-center gap-1 mb-2">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {task.assigned_user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-gray-500">{task.assigned_user.name}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${STATUS_COLORS[task.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="ml-auto text-xs text-red-400 hover:text-red-600 transition"
                          >
                            🗑
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {tasksByStatus(status).length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-xs">
                      No tasks here
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h2>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Task title"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Task description"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                <select
                  value={form.assigned_to}
                  onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Board