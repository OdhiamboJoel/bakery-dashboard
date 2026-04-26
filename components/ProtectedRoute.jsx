"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!profile) {
        router.replace("/login")
        return
      }

      // 🚨 Role check
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(profile.role)
      ) {
        router.replace("/login")
        return
      }

      setLoading(false)
    }

    checkAccess()
  }, [router, allowedRoles])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Checking access...</p>
      </div>
    )
  }

  return children
}