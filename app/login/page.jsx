"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AuthPage() {
  const [mode, setMode] = useState("login") // login | signup | reset
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const resetState = () => {
    setError("")
    setMessage("")
  }

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    resetState()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      window.location.href = "/dashboard"
    }
  }

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    resetState()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Account created! Check your email to confirm.")
      setMode("login")
    }

    setLoading(false)
  }

  // RESET PASSWORD
  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    resetState()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Password reset email sent.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">

      {/* 🌫️ Warm Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />

      {/* 🧁 Compact Card */}
      <div className="bakery-card w-full max-w-sm p-6">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-10 opacity-90" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-amber-900 text-center">
          {mode === "login" && "Welcome Back"}
          {mode === "signup" && "Create Account"}
          {mode === "reset" && "Reset Password"}
        </h1>

        <p className="text-xs text-amber-700/70 text-center mb-5">
          {mode === "login" && "Sign in to continue"}
          {mode === "signup" && "Join the bakery system"}
          {mode === "reset" && "We'll send you a reset link"}
        </p>

        {/* Form */}
        <form
          onSubmit={
            mode === "login"
              ? handleLogin
              : mode === "signup"
              ? handleSignup
              : handleReset
          }
          className="space-y-4 transition-all duration-300"
        >

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2 outline-none transition-all duration-200 focus:border-amber-400 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.25)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password (only for login/signup) */}
          {mode !== "reset" && (
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2 outline-none transition-all duration-200 focus:border-amber-400 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.25)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {/* Error */}
          {error && (
            <div className="text-xs text-red-500 text-center">{error}</div>
          )}

          {/* Success */}
          {message && (
            <div className="text-xs text-green-600 text-center">
              {message}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl transition"
          >
            {loading
              ? "Processing..."
              : mode === "login"
              ? "Sign In"
              : mode === "signup"
              ? "Create Account"
              : "Send Reset Link"}
          </button>
        </form>

        {/* Switch Modes */}
        <div className="mt-5 text-xs text-center text-amber-700 space-y-2">

          {mode === "login" && (
            <>
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-amber-900 font-medium hover:underline"
                >
                  Sign up
                </button>
              </p>

              <p>
                <button
                  onClick={() => setMode("reset")}
                  className="hover:underline"
                >
                  Forgot password?
                </button>
              </p>
            </>
          )}

          {mode !== "login" && (
            <button
              onClick={() => setMode("login")}
              className="hover:underline"
            >
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}