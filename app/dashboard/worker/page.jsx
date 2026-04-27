"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import RouteGuard from "@/components/RouteGuard"

export default function WorkerPage() {
  const [myLogs, setMyLogs] = useState([])

  useEffect(() => {
    async function fetchMyData() {
      const { data, error } = await supabase
        .from("production_logs")
        .select(`
          output,
          created_at,
          workers ( name )
        `)
        .order("created_at", { ascending: false })
        .limit(10)

      if (!error) setMyLogs(data || [])
    }

    fetchMyData()
  }, [])

   useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser()

      console.log("AUTH USER OBJECT:", data.user)
      console.log("AUTH USER ID:", data.user?.id)
      console.log("ERROR:", error)
    }

    checkUser()
  }, [])

  useEffect(() => {
  async function check() {
    const { data: auth } = await supabase.auth.getUser()

    console.log("AUTH USER ID:", auth.user?.id)

    const { data: worker, error } = await supabase
      .from("workers")
      .select("id, name, role, auth_user_id")
      .eq("auth_user_id", auth.user?.id)
      .single()

    console.log("MATCHED WORKER ROW:", worker)
    console.log("ROLE:", worker?.role)
    console.log("ERROR:", error)
  }

  check()
}, [])

  return (
    <RouteGuard allowedRole="worker">
     
    <div className="page-container section">

      {/* HEADER */}
      <div className="bakery-card p-5">
        <h1 className="text-amber-700 font-semibold">
          👨‍🍳 Worker Dashboard
        </h1>
        <p className="text-xs text-amber-900/60">
          Your recent production activity
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bakery-card p-4">
          <p className="text-xs text-amber-900/60">Recent Output</p>
          <h2 className="text-2xl font-bold text-amber-700">
            {myLogs.reduce((sum, l) => sum + l.output, 0)}
          </h2>
        </div>

        <div className="bakery-card p-4">
          <p className="text-xs text-amber-900/60">Entries</p>
          <h2 className="text-2xl font-bold text-amber-700">
            {myLogs.length}
          </h2>
        </div>

        <div className="bakery-card p-4">
          <p className="text-xs text-amber-900/60">Status</p>
          <h2 className="text-2xl font-bold text-green-600">
            Active
          </h2>
        </div>

      </div>

      {/* ACTIVITY FEED */}
      <div className="bakery-card p-5">
        <h3 className="text-amber-700 font-semibold mb-3">
          📦 Your Recent Logs
        </h3>

        <div className="space-y-2">
          {myLogs.map((log, i) => (
            <div key={i} className="text-sm text-amber-900/70">
              🥐 {log.output} units —{" "}
              {new Date(log.created_at).toLocaleString()}
            </div>
          ))}
        </div>
      </div>

    </div>
   </RouteGuard>
  )
}