import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export const useProduction = () => {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("production_logs").select("*")
      setLogs(data || [])
    }

    fetchData()

    const channel = supabase
      .channel("production")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "production_logs" },
        fetchData
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return logs
}