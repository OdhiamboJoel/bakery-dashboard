"use client"

import RouteGuard from "@/components/RouteGuard"
import DashboardLayout from "@/components/DashboardLayout"
import Leaderboard from "@/components/Leaderboard"
import LiveNotifications from "@/components/LiveNotifications"
import AnalyticsCharts from "@/components/AnalyticsCharts"

export default function AdminPage() {
  return (
    <RouteGuard allowedRole="admin">

      <DashboardLayout
        title="Admin Dashboard"
        subtitle="Production insights and system overview"
        sidebar={
          <>
            <div className="bakery-card p-5 lg:p-6">
              <h2 className="font-medium mb-3">Leaderboard</h2>
              <Leaderboard />
            </div>

            <div className="bakery-card p-5 lg:p-6">
              <h2 className="font-medium mb-3">Live Notifications</h2>
              <LiveNotifications />
            </div>
          </>
        }
      >

        {/* ✅ RESTORED: MAIN CONTENT */}

        <div className="bakery-card p-5 lg:p-6">
          <h2 className="font-medium mb-3">Production Analytics</h2>
          <AnalyticsCharts />
        </div>

        {/* If you had second chart before */}
        <div className="bakery-card p-5 lg:p-6">
          <h2 className="font-medium mb-3">Output Trends</h2>
          <AnalyticsCharts type="comparison" />
        </div>

      </DashboardLayout>

    </RouteGuard>
  )
}