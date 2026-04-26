"use client"

import ProtectedRoute from "@/components/ProtectedRoute"

export default function WorkerPage() {
  return (
    <ProtectedRoute allowedRoles={["worker", "admin"]}>

      <div className="min-h-screen bg-orange-50 p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Worker Dashboard</h1>
          <p className="text-gray-600">Track your production tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold">My Production</h2>
            <p className="text-gray-500 text-sm">Today's output</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold">Performance</h2>
            <p className="text-gray-500 text-sm">Efficiency tracking</p>
          </div>

        </div>

        {/* Logs Section */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">My Activity Logs</h2>
          <p className="text-gray-400 text-sm">
            Production history will appear here
          </p>
        </div>

      </div>

    </ProtectedRoute>
  )
}