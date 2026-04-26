import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req) {
  const body = await req.json()

  try {
    const callback = body.Body.stkCallback

    if (callback.ResultCode !== 0) {
      return NextResponse.json({ message: "Payment failed" })
    }

    const metadata = callback.CallbackMetadata.Item

    const amount = metadata.find(i => i.Name === "Amount")?.Value
    const phone = metadata.find(i => i.Name === "PhoneNumber")?.Value
    const mpesa_code = metadata.find(i => i.Name === "MpesaReceiptNumber")?.Value

    // Save payment
    await supabase.from("payments").insert({
      phone: String(phone),
      amount,
      mpesa_code
    })

    // Update customer balance
    const { data: customer } = await supabase
      .from("customers")
      .select("*")
      .eq("phone", String(phone))
      .single()

    if (customer) {
      await supabase
        .from("customers")
        .update({
          balance: customer.balance + amount
        })
        .eq("id", customer.id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Callback error" })
  }
}