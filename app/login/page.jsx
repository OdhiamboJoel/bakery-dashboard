"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Eye, EyeOff } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AuthPage() {
  const [mode, setMode] = useState("login") // login | signup | reset
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

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
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Account created! Check your email to verify.")
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
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />

      {/* CARD */}
      <div
        className="bakery-card mx-auto"
        style={{ width: "340px", maxWidth: "90%" }}
      >

        {/* HEADER */}
        <div className="text-center mb-5">

          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ height: "28px", width: "auto", borderRadius: "18px" }}
            />
            <h1 className="text-xl font-semibold text-amber-900">
              Naithorn Bakery
            </h1>
          </div>

          <h2 className="text-lg font-medium bg-gradient-to-r from-amber-600 to-orange-400 bg-clip-text text-transparent">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "reset" && "Reset Password"}
          </h2>

          <p className="text-xs text-amber-700/70 mt-1">
            {mode === "login" && "Sign in to continue"}
            {mode === "signup" && "Join the bakery system"}
            {mode === "reset" && "We’ll send a reset link"}
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            mode === "login"
              ? handleLogin
              : mode === "signup"
              ? handleSignup
              : handleReset
          }
          className="flex flex-col gap-3"
        >

         {/* FIRST + LAST NAME */}
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="First Name"
                required
                className="w-full bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none py-2 text-sm transition-all"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Last Name"
                required
                className="w-full bg-transparent border-b border-amber-300 focus:border-amber-500 outline-none py-2 text-sm transition-all"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}
          {/* EMAIL */}
         <div className="w-full">
            <input
              type="email"
              placeholder="Email"
              required
              className="input-underline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          {mode !== "reset" && (
            <div className="w-full">

              <div className="flex items-center w-full border-b border-amber-300 focus-within:border-amber-500 transition-all">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="flex-1 bg-transparent outline-none py-2 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-amber-600 hover:text-amber-800"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

              </div>

            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg py-2 px-3 text-center">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {message && (
            <div className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg py-2 px-3 text-center">
              {message}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
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

        {/* SWITCH MODES */}
        <div className="text-xs text-center text-amber-700 space-y-2 mt-4">

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