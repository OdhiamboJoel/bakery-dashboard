import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("deliveries").select("*")
      setDeliveries(data || [])
    }

    fetchData()

    const channel = supabase
      .channel("deliveries")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deliveries" },
        (payload) => {
          fetchData()
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return deliveries
}