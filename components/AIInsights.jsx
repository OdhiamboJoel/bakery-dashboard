"use client"

import { useMemo } from "react"

export default function AIInsights({ logs = [] }) {

  const insights = useMemo(() => {

    if (!logs.length) return []

    const today = new Date().toDateString()

    const todayLogs = logs.filter(
      l => new Date(l.created_at).toDateString() === today
    )

    const totalToday = todayLogs.reduce(
      (sum, l) => sum + (l.cakes || 0),
      0
    )

    const workerMap = {}

    logs.forEach(log => {
      const key = log.worker_phone || "unknown"
      workerMap[key] = (workerMap[key] || 0) + (log.cakes || 0)
    })

    const topWorker = Object.entries(workerMap)
      .sort((a, b) => b[1] - a[1])[0]

    const avg = logs.length
      ? logs.reduce((s, l) => s + (l.cakes || 0), 0) / logs.length
      : 0

    const anomalies = logs.filter(l => (l.cakes || 0) > avg * 2)

    const result = []

    // 📈 Trend insight
    result.push({
      type: "trend",
      message: `Today production: ${totalToday} cakes`
    })

    // 🏆 Top worker
    if (topWorker) {
      result.push({
        type: "top",
        message: `Top worker: ${topWorker[0]} (${topWorker[1]} cakes)`
      })
    }

    // ⚠️ anomaly detection
    if (anomalies.length > 0) {
      result.push({
        type: "alert",
        message: `${anomalies.length} unusual production spikes detected`
      })
    }

    // 📊 average
    result.push({
      type: "avg",
      message: `Average per entry: ${avg.toFixed(1)} cakes`
    })

    return result

  }, [logs])

  const colorMap = {
    trend: "text-blue-600",
    top: "text-green-600",
    alert: "text-red-600",
    avg: "text-purple-600"
  }

  return (
    <div className="space-y-3">

      {insights.map((i, index) => (
        <div
          key={index}
          className="p-3 rounded-lg bg-gray-50 border"
        >
          <p className={`text-sm font-medium ${colorMap[i.type]}`}>
            {i.message}
          </p>
        </div>
      ))}

    </div>
  )
}