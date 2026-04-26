import { getCurrentUser } from "./auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const useRequireRole = (allowedRoles = []) => {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()

    if (!user) {
      router.replace("/login")
      return
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace("/unauthorized")
    }
  }, [router])
}