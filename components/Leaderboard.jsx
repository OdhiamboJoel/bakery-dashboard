"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

export default function Leaderboard({ users = [] }) {
  const [logs, setLogs] = useState([])
  const [prevRanks, setPrevRanks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [toasts, setToasts] = useState([])

  const addToast = (message) => {
  const id = Date.now()

  setToasts((prev) => [
    ...prev,
    { id, message },
  ])

  // auto-remove after 3s
  setTimeout(() => {
    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    )
  }, 3000)
}

  // 📦 Fetch logs
  const fetchLogs = async () => {
    const { data } = await supabase
      .from("production_logs")
      .select("*")

    setLogs(data || [])
  }

  // 📡 realtime + initial load
  useEffect(() => {
    fetchLogs()

    const channel = supabase
      .channel("leaderboard-live")
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

  // 🧠 Build stats
  const stats = {}

  logs.forEach((log) => {
    stats[log.user_id] =
      (stats[log.user_id] || 0) + (log.cakes || 0)
  })

  // 🏆 Ranked list
  const ranked = Object.entries(stats)
    .map(([id, total]) => {
      const user = users.find((u) => u.id === id)

      return {
        id,
        name: user?.name || "Unknown",
        total,
      }
    })
    .sort((a, b) => b.total - a.total)

  // 🔔 Rank change detection
  useEffect(() => {
  if (!ranked.length) return

  const changes = []

  ranked.forEach((current, index) => {
    const prevIndex = prevRanks.findIndex(
      (p) => p.id === current.id
    )

    if (prevIndex === -1) return

    const oldRank = prevIndex + 1
    const newRank = index + 1

    if (oldRank !== newRank) {
      changes.push(
        `${current.name} moved to #${newRank}`
      )
    }
  })

  changes.forEach((msg) => addToast(msg))
  setPrevRanks(ranked)
}, [logs])

  return (
    <div className="bg-white/70 p-6 rounded-xl shadow">

      <h2 className="font-bold mb-4">
        🏆 Live Leaderboard
      </h2>

      {/* 🔔 Notifications */}
      <div className="bg-white/70 p-4 rounded-xl shadow mb-4">
        <h3 className="font-bold mb-2">
          🔔 Rank Updates
        </h3>

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">
            Waiting for rank changes...
          </p>
        ) : (
          notifications.slice(0, 5).map((n, i) => (
            <p key={i} className="text-sm border-b py-1">
              {n}
            </p>
          ))
        )}
      </div>

      {/* 🏆 Animated Leaderboard */}
      <AnimatePresence>
        {ranked.map((u, i) => (
          <motion.div
            key={u.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`flex justify-between p-3 border-b rounded-lg mb-2
              ${i === 0 ? "bg-yellow-100" :
                i === 1 ? "bg-gray-100" :
                i === 2 ? "bg-orange-100" :
                "bg-white/50"}`}
          >

            <div className="flex gap-3 items-center">
              <span className="font-bold">
                #{i + 1}
              </span>
              <span>{u.name}</span>
            </div>

            <span className="font-bold">
              {u.total}
            </span>

          </motion.div>
        ))}
      </AnimatePresence>

      <div className="fixed top-4 right-4 space-y-2 z-50">

  {toasts.map((t) => (
    <div
      key={t.id}
      className="bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in"
    >
      {t.message}
    </div>
  ))}

</div>

    </div>
  )
}