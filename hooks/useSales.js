import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export const useSales = () => {
  const [sales, setSales] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("sales").select("*")
      setSales(data || [])
    }

    fetchData()

    const channel = supabase
      .channel("sales")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sales" },
        fetchData
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return sales
}