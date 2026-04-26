import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export const useAnalytics = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: true })

      setSales(data || [])
      setLoading(false)
    }

    fetchData()

    const channel = supabase
      .channel("analytics-sales")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sales" },
        fetchData
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return { sales, loading }
}