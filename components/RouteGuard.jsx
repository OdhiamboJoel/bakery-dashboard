"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useRole from "@/hooks/useRole"

export default function RouteGuard({ children, allowedRole }) {
  const router = useRouter()
  const { role, loading } = useRole()

  useEffect(() => {
    if (!loading && role && role !== allowedRole) {
      router.replace(`/dashboard/${role}`)
    }
  }, [role, loading])

  if (loading) {
    return <div className="p-6">Checking access...</div>
  }

  if (role !== allowedRole) return null

  return children
}