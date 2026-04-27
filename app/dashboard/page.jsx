"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    async function route() {
      const { data: auth } = await supabase.auth.getUser()

      if (!auth.user) {
        router.replace("/login")
        return
      }

      const { data, error } = await supabase
        .from("workers")
        .select("role")
        .eq("auth_user_id", auth.user.id)
        .single()

      if (error || !data) {
        console.error("Role error:", error)
        router.replace("/login")
        return
      }

      // 🔥 ONLY routing decision here
      router.replace(
        data.role === "admin"
          ? "/dashboard/admin"
          : "/dashboard/worker"
      )
    }

    route()
  }, [])

  return <div className="p-6">Loading dashboard...</div>
}