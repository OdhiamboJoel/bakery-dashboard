import { supabase } from "./supabase"

export const getWorkerStats = async () => {
  const { data, error } = await supabase
    .from("production_logs")
    .select("*")

  if (error) throw error

  const stats = {}

  data.forEach((log) => {
    const worker = log.worker_phone

    if (!stats[worker]) {
      stats[worker] = {
        totalMixes: 0,
        entries: 0
      }
    }

    stats[worker].totalMixes += log.mixes
    stats[worker].entries += 1
  })

  return Object.entries(stats).map(([worker, value]) => ({
    worker,
    ...value,
    avgMixes: value.totalMixes / value.entries
  }))
}