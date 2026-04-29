"use client"

import RouteGuard from "@/components/RouteGuard"
import DashboardLayout from "@/components/DashboardLayout"

import AnalyticsCharts from "@/components/AnalyticsCharts"
import ProductionChart from "@/components/ProductionChart"
import TrendChart from "@/components/TrendChart"
import RevenueChart from "@/components/RevenueChart"

import Leaderboard from "@/components/Leaderboard"
import LiveNotifications from "@/components/LiveNotifications"
import SmartInsights from "@/components/SmartInsights" // or AIInsights

export default function AdminDashboard() {
  return (
    <RouteGuard allowedRole="admin">

      <DashboardLayout>

        <div className="page-container space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-xl font-semibold text-amber-900">
              Admin Dashboard
            </h1>
            <p className="text-xs text-amber-700/70">
              Bakery performance overview & live operations
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

            {/* LEFT SIDE */}
            <div className="xl:col-span-2 space-y-6">

              {/* OVERVIEW */}
              <div className="bakery-card">
                <h2 className="title mb-3">Overview</h2>
                <div className="chart-container">
                  <AnalyticsCharts />
                </div>
              </div>

              {/* PRODUCTION + TREND (2 COL INSIDE) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bakery-card">
                  <h2 className="title mb-3">Production</h2>
                  <div className="chart-container">
                    <ProductionChart />
                  </div>
                </div>

                <div className="bakery-card">
                  <h2 className="title mb-3">Trend</h2>
                  <div className="chart-container">
                    <TrendChart />
                  </div>
                </div>

              </div>

              {/* REVENUE */}
              <div className="bakery-card">
                <h2 className="title mb-3">Revenue</h2>
                <div className="chart-container">
                  <RevenueChart />
                </div>
              </div>

            </div>

            {/* RIGHT SIDE (SIDEBAR) */}
            <div className="space-y-6">

              <div className="bakery-card">
                <h2 className="title mb-3">Top Workers</h2>
                <Leaderboard />
              </div>

              <div className="bakery-card">
                <h2 className="title mb-3">Live Activity</h2>
                <LiveNotifications />
              </div>

              <div className="bakery-card">
                <h2 className="title mb-3">Insights</h2>
                <SmartInsights />
              </div>

            </div>

          </div>

        </div>

      </DashboardLayout>

    </RouteGuard>
  )
}