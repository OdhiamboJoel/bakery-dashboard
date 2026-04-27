"use client"

import RouteGuard from "@/components/RouteGuard"
import DashboardLayout from "@/components/DashboardLayout"

export default function SalesPage() {
  return (
    <RouteGuard allowedRole="admin">

      <DashboardLayout
        title="Sales Overview"
        subtitle="Revenue, orders, and performance insights"
        sidebar={
          <>
            <div className="bakery-card p-5 lg:p-6">
              <h2 className="font-medium mb-3">Top Products</h2>
              <div className="text-sm">Bread, Cakes, Pastries...</div>
            </div>

            <div className="bakery-card p-5 lg:p-6">
              <h2 className="font-medium mb-3">Order Status</h2>
              <div className="text-sm">Completed / Pending / Cancelled</div>
            </div>
          </>
        }
      >

        <div className="bakery-card p-5 lg:p-6">
          <h2 className="font-medium mb-3">Revenue Summary</h2>
          <div className="text-sm">KPI cards go here</div>
        </div>

        <div className="bakery-card p-5 lg:p-6">
          <h2 className="font-medium mb-3">Sales Trends</h2>
          <div className="h-64 flex items-center justify-center text-amber-700/60">
            Chart Area
          </div>
        </div>

      </DashboardLayout>

    </RouteGuard>
  )
}