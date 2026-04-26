"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { supabase } from "@/lib/supabase"

// your components
import AnalyticsCharts from "@/components/AnalyticsCharts"
import Leaderboard from "@/components/Leaderboard"
import AIInsights from "@/components/AIInsights"

export default function AdminPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  // 📦 FETCH PRODUCTION LOGS
  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("production_logs")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchLogs()

    // 🔄 realtime updates
    const channel = supabase
      .channel("admin-live-logs")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "production_logs",
        },
        () => {
          fetchLogs()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <ProtectedRoute allowedRoles={["admin"]}>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Bakery performance overview
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-sm text-gray-500">Total Logs</h2>
            <p className="text-2xl font-bold">{logs.length}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-sm text-gray-500">Active Workers</h2>
            <p className="text-2xl font-bold">--</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-sm text-gray-500">Production Status</h2>
            <p className="text-green-600 font-semibold">Live</p>
          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CHARTS */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4">📊 Analytics</h2>

            <AnalyticsCharts logs={logs} />
          </div>

          <div className="mt-6 bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">🧠 AI Business Insights</h2>

          <AIInsights logs={logs} />
          </div>

          {/* LEADERBOARD */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4">🏆 Leaderboard</h2>

            <Leaderboard />
          </div>

        </div>

        {/* LOGS SECTION */}
        <div className="mt-6 bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">📦 Production Logs</h2>

          {loading ? (
            <p className="text-gray-500">Loading logs...</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">

              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex justify-between border-b py-2 text-sm"
                >
                  <span>{log.cakes} cakes</span>
                  <span className="text-gray-500">
                    {log.worker_phone}
                  </span>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </ProtectedRoute>
  )
}