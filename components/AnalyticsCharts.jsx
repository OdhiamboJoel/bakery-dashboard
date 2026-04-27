"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

export default function AnalyticsCharts() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("production_logs")
        .select("output, created_at")

      if (error || !data) return

      const grouped = {}

      data.forEach((item) => {
        const date = new Date(item.created_at)
          .toISOString()
          .split("T")[0]

        if (!grouped[date]) grouped[date] = 0
        grouped[date] += item.output
      })

      const sorted = Object.entries(grouped)
        .map(([date, output]) => ({ date, output }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-7)

      setChartData(sorted)
    }

    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* LINE CHART CARD */}
      <div className="bakery-card p-6 h-[380px] flex flex-col border border-amber-100/60">

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="text-amber-800 font-semibold text-base">
            Production Trend
          </h3>
          <p className="text-xs text-amber-900/50">
            Last 7 days performance overview
          </p>
        </div>

        {/* CHART */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3e8d7"
                opacity={0.6}
              />

              <XAxis
                dataKey="date"
                tickFormatter={(v) => v.slice(5)}
                tick={{ fontSize: 12, fill: "#a16207" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12, fill: "#a16207" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff7ed",
                  border: "1px solid #fbbf24",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />

              <Line
                type="monotone"
                dataKey="output"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#fb923c" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART CARD */}
      <div className="bakery-card p-6 h-[380px] flex flex-col border border-amber-100/60">

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="text-amber-800 font-semibold text-base">
            Output Distribution
          </h3>
          <p className="text-xs text-amber-900/50">
            Daily production comparison
          </p>
        </div>

        {/* CHART */}
        <div className="w-full h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3e8d7"
                opacity={0.6}
              />

              <XAxis
                dataKey="date"
                tickFormatter={(v) => v.slice(5)}
                tick={{ fontSize: 12, fill: "#a16207" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12, fill: "#a16207" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff7ed",
                  border: "1px solid #fbbf24",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="output"
                fill="#fb923c"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  )
}