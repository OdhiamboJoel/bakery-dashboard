"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function useRole() {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRole() {
      const { data: auth } = await supabase.auth.getUser()

      if (!auth.user) {
        setRole(null)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("workers")
        .select("role")
        .eq("auth_user_id", auth.user.id)
        .single()

      setRole(data?.role || null)
      setLoading(false)
    }

    loadRole()
  }, [])

  return { role, loading }
}