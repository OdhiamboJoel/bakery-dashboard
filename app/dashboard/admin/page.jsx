"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import DashboardLayout from "@/components/DashboardLayout"
import AnalyticsCharts from "@/components/AnalyticsCharts"
import SmartInsights from "@/components/SmartInsights"
import Leaderboard from "@/components/Leaderboard"
import LiveNotifications from "@/components/LiveNotifications"

export default function AdminPage() {
  const [profile, setProfile] = useState(null)
  const [logs, setLogs] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      // 🔐 Get logged-in user
      const { data: authData } = await supabase.auth.getUser()
      const user = authData?.user

      if (!user) {
        window.location.href = "/login"
        return
      }

      // 👤 Get profile (role check)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!profileData || profileData.role !== "admin") {
        window.location.href = "/login"
        return
      }

      setProfile(profileData)

      // 📦 Fetch production logs
      const { data: logsData } = await supabase
        .from("production_logs")
        .select("*")

      setLogs(logsData || [])

      // 👥 Fetch all users
      const { data: usersData } = await supabase
        .from("profiles")
        .select("*")

      setUsers(usersData || [])

      setLoading(false)
    }

    loadData()
  }, [])

  const updateRole = async (userId, role) => {
    await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)

    // refresh users
    const { data } = await supabase.from("profiles").select("*")
    setUsers(data || [])
  }

  if (loading) return <p className="p-6">Loading dashboard...</p>

  return (
    <DashboardLayout role="admin">

      <div className="space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Admin Control Panel</h1>
          <p className="text-gray-500">Manage system performance & users</p>
        </div>

         <LiveNotifications />

        {/* 📊 SMART INSIGHTS */}
        <SmartInsights logs={logs} users={users} />

        {/* 🏆 LEADERBOARD */}
        <Leaderboard logs={logs} users={users} />

        {/* 📈 ANALYTICS */}
        <AnalyticsCharts logs={logs} />

        {/* 👥 USER MANAGEMENT */}
        <div className="bg-white/70 p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">User Management</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500">
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2">{u.name || "No Name"}</td>

                  <td>
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                      {u.role}
                    </span>
                  </td>

                  <td className="flex gap-2 py-2">
                    <button
                      onClick={() => updateRole(u.id, "admin")}
                      className="px-2 py-1 text-xs bg-blue-100 rounded"
                    >
                      Admin
                    </button>

                    <button
                      onClick={() => updateRole(u.id, "worker")}
                      className="px-2 py-1 text-xs bg-green-100 rounded"
                    >
                      Worker
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </DashboardLayout>
  )
}