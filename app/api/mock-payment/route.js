import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const body = await req.json()
    const { phone, amount } = body

    console.log("Incoming mock payment:", body)

    if (!phone || !amount) {
      return NextResponse.json(
        { error: "Missing phone or amount" },
        { status: 400 }
      )
    }

    // STEP 1: insert payment
    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .insert({
        phone,
        amount,
        mpesa_code: "MOCK_PAYMENT"
      })
      .select()

    if (paymentError) {
      console.error("PAYMENT INSERT ERROR:", paymentError)
      return NextResponse.json(
        { error: paymentError.message },
        { status: 500 }
      )
    }

    // STEP 2: update customer
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("phone", phone)
      .single()

    if (customerError && customerError.code !== "PGRST116") {
      console.error("CUSTOMER ERROR:", customerError)
      return NextResponse.json(
        { error: customerError.message },
        { status: 500 }
      )
    }

    if (customer) {
      await supabase
        .from("customers")
        .update({
          balance: customer.balance + amount
        })
        .eq("id", customer.id)
    }

    return NextResponse.json({
      success: true,
      paymentData
    })

  } catch (err) {
    console.error("FULL API CRASH:", err)

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}