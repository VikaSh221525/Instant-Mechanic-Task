"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Zap,
  LayoutDashboard,
  CalendarCheck,
  Wrench,
  Users,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useSocketContext } from "@/providers/SocketProvider";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/mechanics", label: "Mechanics", icon: Wrench },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isConnected } = useSocketContext();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-8 h-16 border-b border-border bg-background/80 backdrop-blur-sm">
      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-accent"
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
          }
        />
        <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-foreground tracking-tight">
                Instant Mechanic
              </h1>
              <p className="text-[11px] text-muted-foreground">Operations Dashboard</p>
            </div>
          </div>
          <nav className="px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-foreground truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            isConnected
              ? "bg-emerald-500 animate-pulse"
              : "bg-red-500"
          )}
        />
        <span className="text-xs font-medium text-muted-foreground">
          {isConnected ? "Live" : "Offline"}
        </span>
      </div>
    </header>
  );
}
