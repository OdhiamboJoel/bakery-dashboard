"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function DeliveryPage() {
  const [crates, setCrates] = useState(0)

  const startTrip = async () => {
    const { error } = await supabase.from("deliveries").insert({
      crates_taken: crates,
      departure_time: new Date(),
      status: "in_transit"
    })

    if (error) return alert(error.message)

    alert("Trip started")
    setCrates(0)
  }

  const completeTrip = async (id) => {
    const broken = prompt("Broken cakes?")
    const returned = prompt("Empty crates returned?")

    const { error } = await supabase
      .from("deliveries")
      .update({
        arrival_time: new Date(),
        status: "arrived",
        broken_cakes: Number(broken),
        empty_crates_returned: Number(returned)
      })
      .eq("id", id)

    if (error) return alert(error.message)

    alert("Trip completed")
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <h1 className="text-2xl font-bold text-amber-800 mb-6">
        Delivery Panel
      </h1>

      <div className="bg-white p-4 rounded shadow w-80 mb-6">
        <input
          type="number"
          placeholder="Crates to deliver"
          value={crates}
          onChange={(e) => setCrates(Number(e.target.value))}
          className="w-full border p-2 mb-4"
        />

        <button
          onClick={startTrip}
          className="bg-amber-600 text-white px-4 py-2 rounded w-full"
        >
          Start Delivery
        </button>
      </div>
    </div>
  )
}