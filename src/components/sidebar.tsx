"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Code2,
  Users,
  CalendarCheck,
  Target,
  StickyNote,
  Menu,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"


const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Opportunities", href: "/opportunities", icon: TrendingUp },
  { label: "Articles", href: "/articles", icon: FileText },
  { label: "Open Source", href: "/open-source", icon: Code2 },
  { label: "Community", href: "/community", icon: Users },
  { label: "Weekly Review", href: "/weekly-review", icon: CalendarCheck },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Notes", href: "/notes", icon: StickyNote },
]

function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function Sidebar() {
  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:border-r lg:border-sidebar-border lg:bg-sidebar">
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="flex size-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
            D
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground">
            DevRel OS
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-3 left-3 z-40 flex lg:hidden"
            />
          }
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
            <div className="flex size-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
              D
            </div>
            <span className="text-sm font-semibold text-sidebar-foreground">
              DevRel OS
            </span>
          </div>
          <SidebarNav />
        </SheetContent>
      </Sheet>
    </>
  )
}
