"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import DashboardLayout from "@/components/DashboardLayout"

export default function WorkerPage() {
  const [profile, setProfile] = useState(null)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser()

      if (!authData?.user) return

      const userId = authData.user.id

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (!profileData || profileData.role !== "worker") {
        window.location.href = "/login"
        return
      }

      setProfile(profileData)

      const { data: logData } = await supabase
        .from("production_logs")
        .select("*")
        .eq("user_id", userId)

      setLogs(logData || [])
    }

    load()
  }, [])

  if (!profile) return <p>Loading...</p>

  const total = logs.reduce((sum, l) => sum + (l.cakes || 0), 0)

  return (
    <DashboardLayout role="worker">
      <div>
        <h2>Welcome {profile.name || "Worker"} 👷</h2>

        <div className="card">
          <p>Role: {profile.role}</p>
          <p>Total Cakes: {total}</p>
          <p>Entries: {logs.length}</p>
        </div>

        <div className="card">
          <h3>Recent Production</h3>

          {logs.length === 0 ? (
            <p>No records yet</p>
          ) : (
            logs.map((log, i) => (
              <p key={i}>
                {log.cakes} cakes —{" "}
                {new Date(log.created_at).toLocaleString()}
              </p>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}