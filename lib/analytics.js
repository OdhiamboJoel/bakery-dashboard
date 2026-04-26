import { supabase } from "./supabase"

export async function getTotalRevenue() {
  const { data } = await supabase
    .from("revenue_summary")
    .select("*")
    .single()

  const pricePerCake = 50
  return (data?.total_cakes || 0) * pricePerCake
}

export async function getDailyProduction() {
  const { data } = await supabase
    .from("daily_production")
    .select("*")

  return data || []
}

export async function getWorkerLeaderboard() {
  const { data, error } = await supabase
    .from("worker_leaderboard")
    .select("*")

  if (error) throw error

  return data || []
}

export async function getWorkerPerformance() {
  const { data } = await supabase
    .from("worker_performance")
    .select("*")

  return data || []
}

export async function getWeeklyLeaderboard() {
  const { data, error } = await supabase
    .from("weekly_leaderboard")
    .select("*")

  if (error) throw error

  return data || []
}

export async function getLastWeekLeaderboard() {
  const { data, error } = await supabase
    .from("last_week_leaderboard")
    .select("*")

  if (error) throw error

  return data || []
}