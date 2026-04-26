"use client"

export default function SmartInsights({ logs = [], users = [] }) {
  if (!logs.length) {
    return (
      <div className="bg-white/70 p-4 rounded-xl shadow">
        No data available for insights yet.
      </div>
    )
  }

  // 🔢 TOTAL PRODUCTION
  const totalProduction = logs.reduce((sum, l) => sum + (l.cakes || 0), 0)

  // 👷 GROUP BY USER
  const userStats = {}

  logs.forEach((log) => {
    if (!userStats[log.user_id]) {
      userStats[log.user_id] = 0
    }
    userStats[log.user_id] += log.cakes || 0
  })

  // 🏆 TOP & LOWEST WORKER
  const sorted = Object.entries(userStats).sort((a, b) => b[1] - a[1])

  const topWorker = sorted[0]
  const lowestWorker = sorted[sorted.length - 1]

  // 📈 TREND (simple comparison: first half vs second half)
  const mid = Math.floor(logs.length / 2)
  const firstHalf = logs.slice(0, mid)
  const secondHalf = logs.slice(mid)

  const firstSum = firstHalf.reduce((s, l) => s + (l.cakes || 0), 0)
  const secondSum = secondHalf.reduce((s, l) => s + (l.cakes || 0), 0)

  const trend =
    secondSum > firstSum ? "📈 Increasing" : "📉 Declining"

  // ⚠️ ALERT
  const avgPerLog = totalProduction / logs.length
  const alert =
    avgPerLog < 5
      ? "⚠️ Low productivity detected"
      : "✅ Productivity stable"

  return (
    <div className="grid md:grid-cols-2 gap-4">

      {/* TOTAL */}
      <div className="bg-white/70 p-4 rounded-xl shadow">
        <h3 className="font-bold">Total Production</h3>
        <p className="text-2xl font-bold">{totalProduction} cakes</p>
      </div>

      {/* TREND */}
      <div className="bg-white/70 p-4 rounded-xl shadow">
        <h3 className="font-bold">Production Trend</h3>
        <p className="text-xl">{trend}</p>
      </div>

      {/* TOP WORKER */}
      <div className="bg-white/70 p-4 rounded-xl shadow">
        <h3 className="font-bold">Top Worker</h3>
        <p className="text-xl">
          {topWorker ? `${topWorker[0]} (${topWorker[1]} cakes)` : "N/A"}
        </p>
      </div>

      {/* LOWEST WORKER */}
      <div className="bg-white/70 p-4 rounded-xl shadow">
        <h3 className="font-bold">Lowest Performer</h3>
        <p className="text-xl">
          {lowestWorker ? `${lowestWorker[0]} (${lowestWorker[1]} cakes)` : "N/A"}
        </p>
      </div>

      {/* ALERT */}
      <div className="bg-white/70 p-4 rounded-xl shadow md:col-span-2">
        <h3 className="font-bold">System Insight</h3>
        <p className="text-lg">{alert}</p>
      </div>

    </div>
  )
}