"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

export default function RevenueChart({ sales }) {
  // Group sales by hour
  const data = sales.reduce((acc, sale) => {
    const hour = new Date(sale.created_at).getHours()

    const existing = acc.find((d) => d.hour === hour)

    if (existing) {
      existing.revenue += sale.total
    } else {
      acc.push({ hour, revenue: sale.total })
    }

    return acc
  }, [])

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-4">Revenue per Hour</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#f59e0b" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}