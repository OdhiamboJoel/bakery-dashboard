import { supabase } from "./supabase"

/**
 * Adds a payment (MPesa or manual) and updates customer balance
 */
export const addPayment = async ({ phone, amount, reference = "MANUAL" }) => {
  if (!phone || !amount) {
    throw new Error("Phone and amount are required")
  }

  // 1. Normalize phone format (optional safety)
  const formattedPhone = phone.startsWith("0")
    ? "254" + phone.slice(1)
    : phone

  // 2. Record payment in payments table
  const { error: paymentError } = await supabase.from("payments").insert({
    phone: formattedPhone,
    amount,
    mpesa_code: reference
  })

  if (paymentError) {
    console.error("Payment insert error:", paymentError)
    throw paymentError
  }

  // 3. Find customer
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("phone", formattedPhone)
    .single()

  if (customerError && customerError.code !== "PGRST116") {
    console.error("Customer fetch error:", customerError)
    throw customerError
  }

  // 4. If customer doesn't exist, create them automatically
  let customerId = null

  if (!customer) {
    const { data: newCustomer, error: createError } = await supabase
      .from("customers")
      .insert({
        name: "Walk-in Customer",
        phone: formattedPhone,
        balance: amount
      })
      .select()
      .single()

    if (createError) throw createError
    customerId = newCustomer.id
  } else {
    // 5. Update existing customer balance
    customerId = customer.id

    const { error: updateError } = await supabase
      .from("customers")
      .update({
        balance: customer.balance + amount
      })
      .eq("id", customer.id)

    if (updateError) throw updateError
  }

  return {
    success: true,
    customerId,
    message: "Payment processed successfully"
  }
}