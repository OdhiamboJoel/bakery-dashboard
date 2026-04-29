"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TrendChart() {
  const [data, setData] = useState([])

  const fetchData = useCallback(async () => {
    const { data: rows, error } = await supabase
      .from("production_logs")
      .select("mixes, crates, cakes, created_at")

    if (error || !rows) {
      console.error("TrendChart:", error)
      return
    }

    const grouped = {}

    rows.forEach(r => {
      const day = new Date(r.created_at || Date.now())
        .toLocaleDateString("en-KE", { weekday: "short" })

      const total =
        (r.mixes ?? 0) +
        (r.crates ?? 0) +
        (r.cakes ?? 0)

      grouped[day] = (grouped[day] || 0) + total
    })

    const formatted = Object.entries(grouped).map(
      ([day, output]) => ({ day, output })
    )

    setData(formatted)
  }, [])

  useEffect(() => {
    fetchData()

    let timeout

    const channel = supabase
      .channel("trend-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "production_logs" },
        () => {
          clearTimeout(timeout)
          timeout = setTimeout(fetchData, 300)
        }
      )
      .subscribe()

    return () => {
      clearTimeout(timeout)
      supabase.removeChannel(channel)
    }
  }, [fetchData])

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="output" stroke="#f59e0b" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}