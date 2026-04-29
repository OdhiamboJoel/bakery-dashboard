"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Leaderboard() {
  const [workers, setWorkers] = useState([])

  const fetchLeaderboard = useCallback(async () => {
    const { data: rows } = await supabase
      .from("production_logs")
      .select("*")

    if (!rows) return

    const grouped = {}

    rows.forEach(item => {
      const total =
        (item.mixes ?? 0) +
        (item.crates ?? 0) +
        (item.cakes ?? 0)

      grouped[item.worker_id] =
        (grouped[item.worker_id] || 0) + total
    })

    const { data: workerData } = await supabase
      .from("workers")
      .select("id, name")

    if (!workerData) return

    const merged = workerData.map(w => ({
      name: w.name,
      total: grouped[w.id] || 0,
    }))

    setWorkers(merged.sort((a, b) => b.total - a.total))
  }, [])

  useEffect(() => {
    fetchLeaderboard()

    let timeout

    const channel = supabase
      .channel("leaderboard-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "production_logs" },
        () => {
          clearTimeout(timeout)
          timeout = setTimeout(fetchLeaderboard, 300)
        }
      )
      .subscribe()

    return () => {
      clearTimeout(timeout)
      supabase.removeChannel(channel)
    }
  }, [fetchLeaderboard])

  return (
    <div className="space-y-2 text-sm">
      {workers.map((w, i) => (
        <div key={i} className="flex justify-between">
          <span>{i + 1}. {w.name}</span>
          <span className="text-amber-700 font-medium">{w.total}</span>
        </div>
      ))}
    </div>
  )
}