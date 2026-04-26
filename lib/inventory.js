import { supabase } from "./supabase"

export const updateInventoryFromProduction = async ({
  product_id,
  crates,
  cakes
}) => {
  // check if inventory exists
  const { data } = await supabase
    .from("inventory")
    .select("*")
    .eq("product_id", product_id)
    .eq("location", "store")
    .single()

  if (!data) {
    // create new stock record
    await supabase.from("inventory").insert({
      product_id,
      location: "store",
      crates,
      cakes
    })
  } else {
    // update existing stock
    await supabase
      .from("inventory")
      .update({
        crates: data.crates + crates,
        cakes: data.cakes + cakes
      })
      .eq("id", data.id)
  }
}