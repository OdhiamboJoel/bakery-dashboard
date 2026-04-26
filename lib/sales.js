export const makeSale = async ({
  phone,
  cakes,
  price_per_cake
}) => {
  const total = cakes * price_per_cake

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("phone", phone)
    .single()

  if (!customer) {
    alert("Customer not found")
    return
  }

  if (customer.balance < total) {
    alert("Insufficient balance")
    return
  }

  await supabase
    .from("customers")
    .update({
      balance: customer.balance - total
    })
    .eq("id", customer.id)

  await supabase.from("sales").insert({
    customer_id: customer.id,
    cakes,
    price_per_cake,
    total
  })
}