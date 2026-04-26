"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LiveNotifications() {
  const [notifications, setNotifications] = useState([])

  // ➕ add notification helper
  const addNotification = (message) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        message,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ])
  }

  useEffect(() => {
    // 📡 SUBSCRIBE TO REAL-TIME LOGS
    const channel = supabase
      .channel("live-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "production_logs",
        },
        (payload) => {
          const log = payload.new

          addNotification(
            `👷 New entry: ${log.cakes} cakes logged`
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="bg-white/70 p-4 rounded-xl shadow h-full">

      <h2 className="font-bold mb-4">🔔 Live Activity</h2>

      <div className="space-y-2 max-h-[400px] overflow-auto">

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">
            Waiting for activity...
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="p-2 bg-white rounded-lg border text-sm"
            >
              <p>{n.message}</p>
              <p className="text-xs text-gray-400">
                {n.time}
              </p>
            </div>
          ))
        )}

      </div>

    </div>
  )
}