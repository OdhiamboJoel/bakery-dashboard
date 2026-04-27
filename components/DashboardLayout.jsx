"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isExpanded = !collapsed || hovered
  const sidebarWidth = isExpanded ? 260 : 80

  const isActive = (path) => pathname === path

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-50 flex flex-col transition-all duration-300"
        style={{ width: sidebarWidth }}
      >

        {/* HEADER */}
        <div className="p-4 border-b flex items-center justify-between min-w-0">
          {isExpanded && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-orange-500 truncate">🍞 Bakery</h1>
              <p className="text-xs text-gray-500 truncate">Dashboard</p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-gray-100"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-2 space-y-1 min-w-0">

          <NavItem
            icon="📊"
            label="Admin"
            href="/dashboard/admin"
            active={isActive("/dashboard/admin")}
            expanded={isExpanded}
          />

          <NavItem
            icon="👷"
            label="Worker"
            href="/dashboard/worker"
            active={isActive("/dashboard/worker")}
            expanded={isExpanded}
          />

          <div className="my-3 border-t border-gray-200" />

          <NavButton
            icon="🚪"
            label="Logout"
            onClick={handleLogout}
            expanded={isExpanded}
            danger
          />

        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main
        className="flex-1 p-4 md:p-6 overflow-x-hidden"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="max-w-7xl mx-auto min-w-0">
          {children}
        </div>
      </main>

    </div>
  )
}

/* NAV ITEM */
function NavItem({ icon, label, href, expanded }) {
  return (
    <div className="relative group min-w-0">
      <Link
        href={href}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition min-w-0"
      >
        <span>{icon}</span>
        {expanded && <span className="truncate">{label}</span>}
      </Link>

      {!expanded && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
          bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 
          group-hover:opacity-100 transition whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  )
}

/* NAV BUTTON */
function NavButton({ icon, label, onClick, expanded, danger }) {
  return (
    <div className="relative group min-w-0">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition min-w-0
          ${danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"}`}
      >
        <span>{icon}</span>
        {expanded && <span className="truncate">{label}</span>}
      </button>

      {!expanded && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
          bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 
          group-hover:opacity-100 transition whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  )
}