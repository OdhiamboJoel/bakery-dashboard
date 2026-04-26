"use client"

import { useState } from "react"
import { makeSale } from "@/lib/sales"
import AnalyticsCharts from "@/components/AnalyticsCharts"

export default function SalesPage() {
  const [phone, setPhone] = useState("")
  const [cakes, setCakes] = useState(0)
  const [price, setPrice] = useState(50)

  const total = cakes * price  

  const handleSale = async () => {
    await makeSale({
        phone,
        cakes,
        price_per_cake: price
    })
  }

const handleSubmit = async () => {
  try {
    const { data, error: userError } = await supabase.auth.getUser()

    if (userError || !data?.user) {
      console.log("No authenticated user")
      return
    }

    const user = data.user

    const { error } = await supabase.from("production_logs").insert({
      cakes,
      worker_phone,
      user_id: user.id
    })

    if (error) {
      console.log("Insert error:", error.message)
    }

  } catch (err) {
    console.log("Unexpected error:", err)
  }
}

  const requestPayment = async () => {
    await fetch("/api/mpesa/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        phone,
        amount: total
    })
  })
}

  const mockPayment = async () => {
  console.log("PAYLOAD:", {
    phone,
    amount: total
  })

  await fetch("/api/mock-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone,
      amount: total
    })
  })
}

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <h1 className="text-xl font-bold mb-4">Sales Panel</h1>

      <input
        placeholder="Customer Phone"
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <input
        type="number"
        placeholder="Cakes"
        onChange={(e) => setCakes(Number(e.target.value))}
        className="border p-2 mb-2 w-full"
      />

      <select
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border p-2 mb-4 w-full"
      >
        <option value={50}>Retail (50)</option>
        <option value={43}>Wholesale (43)</option>
      </select>
      <button
        onClick={requestPayment}
        className="bg-blue-600 text-white p-2 rounded w-full mt-2"
      >
        Request MPesa Payment
      </button>
      <button
        onClick={mockPayment}
        className="bg-purple-600 text-white p-2 rounded w-full mt-2"
      >
       Simulate Payment (Test)
      </button>
      <button
        onClick={handleSale}
        className="bg-green-600 text-white p-2 rounded w-full"
      >
        Complete Sale
      </button>
    </div>
  )
}