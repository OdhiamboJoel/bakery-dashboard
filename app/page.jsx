"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        // 🔐 If no user → go to login
        if (!user) {
          router.replace("/login")
          return
        }

        // 👤 If user exists → check role
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (error || !profile) {
          router.replace("/login")
          return
        }

        // 🧭 Route by role
        if (profile.role === "admin") {
          router.replace("/admin")
        } else if (profile.role === "worker") {
          router.replace("/worker")
        } else {
          router.replace("/login")
        }

      } catch (err) {
        console.error("Auth routing error:", err)
        router.replace("/login")
      }
    }

    checkUser()
  }, [router])

  // Optional loading state
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Loading dashboard...</p>
    </div>
  )
}