"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from("users").select("*")
      console.log("Supabase test:", data, error)
    }

    test()
  }, [])

  return (
    <div className="p-10">
      <h1>Naithorn Bakery System Running</h1>
      <p>Check console for Supabase connection test</p>
    </div>
  )
}