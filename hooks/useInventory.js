import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export const useInventory = () => {
  const [inventory, setInventory] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("inventory").select("*")
      setInventory(data || [])
    }

    fetchData()

    const channel = supabase
      .channel("inventory")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        fetchData
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return inventory
}