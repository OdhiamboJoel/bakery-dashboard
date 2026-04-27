"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
  e.preventDefault()

  // 🔥 Step 1: force logout first
  await supabase.auth.signOut()

  // 🔥 Step 2: login new user
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    alert(error.message)
    return
  }

  console.log("✅ Logged in as:", data.user.email)

  // 🔥 Step 3: go to dashboard
  router.push("/dashboard")
}

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-orange-500 text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  )
}