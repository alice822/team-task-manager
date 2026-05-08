import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444']

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/')
        setStats(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const chartData = stats ? [
    { name: 'Todo', value: stats.todo },
    { name: 'In Progress', value: stats.in_progress },
    { name: 'Done', value: stats.done },
    { name: 'Overdue', value: stats.overdue },
  ] : []

  const statCards = stats ? [
    { label: 'Total Projects', value: stats.total_projects, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Tasks', value: stats.total_tasks, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'In Progress', value: stats.in_progress, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Done', value: stats.done, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Todo', value: stats.todo, color: 'text-gray-600', bg: 'bg-gray-50' },
    { label: 'Overdue', value: stats.overdue, color: 'text-red-600', bg: 'bg-red-50' },
  ] : []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">Welcome back! Here's your overview.</p>

        {loading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {statCards.map((card) => (
                <div key={card.label} className={`${card.bg} rounded-xl p-6`}>
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className={`text-3xl font-semibold ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-700 mb-4">Tasks by Status</h2>
                {stats.total_tasks === 0 ? (
                  <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                    No tasks yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Project Progress */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-700 mb-4">Project Progress</h2>
                {stats.project_stats?.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                    No projects yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.project_stats?.map((project) => (
                      <div key={project.id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{project.name}</span>
                          <span className="text-xs text-gray-500">
                            {project.completed_tasks}/{project.total_tasks} tasks
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{project.progress}% complete</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard