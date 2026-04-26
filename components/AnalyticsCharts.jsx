"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"

export default function AnalyticsCharts({ logs = [] }) {
  // GROUP BY DATE
  const dailyData = logs.reduce((acc, log) => {
    const date = new Date(log.created_at).toLocaleDateString()

    const existing = acc.find((item) => item.date === date)
    

    if (existing) {
      existing.cakes += log.cakes || 0
    } else {
      acc.push({ date, cakes: log.cakes || 0 })
    }

    return acc
  }, [])

  return (
    <div className="space-y-10">

      {/* LINE CHART */}
      <div className="bg-white/70 backdrop-blur p-4 rounded-xl shadow">
        <h3 className="font-bold mb-4">Production Trend</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="cakes"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="bg-white/70 backdrop-blur p-4 rounded-xl shadow">
        <h3 className="font-bold mb-4">Daily Output Comparison</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cakes" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}