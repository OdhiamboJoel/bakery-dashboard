"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ProductionChart() {
  const [data, setData] = useState([])

  const fetchData = useCallback(async () => {
    const { data: rows, error } = await supabase
      .from("production_logs")
      .select("mixes, crates, cakes")

    if (error || !rows) {
      console.error("ProductionChart:", error)
      return
    }

    let mixes = 0, crates = 0, cakes = 0

    rows.forEach(r => {
      mixes += r.mixes ?? 0
      crates += r.crates ?? 0
      cakes += r.cakes ?? 0
    })

    setData([
      { name: "Mixes", value: mixes },
      { name: "Crates", value: crates },
      { name: "Cakes", value: cakes },
    ])
  }, [])

  useEffect(() => {
    fetchData()

    let timeout

    const channel = supabase
      .channel("prod-rt")
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
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  )
}