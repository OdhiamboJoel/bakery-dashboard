"use client"

export default function DashboardLayout({ title, subtitle, sidebar, children }) {
  return (
    <div className="min-h-screen safe-container px-6 lg:px-10 py-6 lg:py-10">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-amber-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-amber-700/70">
            {subtitle}
          </p>
        )}
      </div>

      {/* GRID SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* MAIN */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          {children}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8 sidebar-sticky">
          {sidebar}
        </div>

      </div>

    </div>
  )
}