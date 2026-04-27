"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Leaderboard() {
  const [workers, setWorkers] = useState([])

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("production_logs")
       .select(`
    output,
    workers ( name )
  `)
  console.log("Leaderboard raw data:", data)

    if (error) {
      console.error(error)
      return
    }

    // 🔥 AGGREGATE BY WORKER
    const grouped = {}

data.forEach((item) => {
  const name = item.workers?.name || "Unknown"

  if (!grouped[name]) grouped[name] = 0
  grouped[name] += item.output
})

const sorted = Object.entries(grouped)
  .map(([name, output]) => ({ name, output }))
  .sort((a, b) => b.output - a.output)

setWorkers(sorted)
  }

  return (
    <div className="space-y-3">

      {workers.map((worker, index) => (
        <div
          key={worker.name}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-500">
              #{index + 1}
            </span>
            <span className="text-gray-800">
              {worker.name}
            </span>
          </div>

          <span className="font-semibold text-orange-500">
            {worker.output}
          </span>
        </div>
      ))}

    </div>
  )
}