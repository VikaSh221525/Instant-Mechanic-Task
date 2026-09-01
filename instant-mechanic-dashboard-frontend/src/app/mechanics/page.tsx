"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MechanicCard } from "@/components/mechanics/MechanicCard";
import { useMechanics } from "@/hooks/useMechanics";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { MechanicStatus, type MechanicFilters } from "@/types/mechanic";

export default function MechanicsPage() {
  const [filters, setFilters] = useState<MechanicFilters>({
    page: 1,
    limit: 12,
  });

  const { data, isLoading } = useMechanics(filters);
  const mechanics = data?.data || [];
  const meta = data?.meta;

  return (
    <>
      <Header
        title="Mechanics"
        subtitle={meta ? `${meta.total} mechanics` : undefined}
      />
      <div className="p-4 lg:p-8 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search mechanics…"
              value={filters.search || ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
              }
              className="pl-9 bg-secondary border-border"
            />
          </div>
          <Select
            value={filters.status || "ALL"}
            onValueChange={(value) =>
              setFilters((f) => ({
                ...f,
                status: !value || value === "ALL" ? "" : (value as MechanicStatus),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[160px] bg-secondary border-border">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value={MechanicStatus.AVAILABLE}>Available</SelectItem>
              <SelectItem value={MechanicStatus.BUSY}>Busy</SelectItem>
              <SelectItem value={MechanicStatus.OFFLINE}>Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[220px] rounded-xl" />
            ))}
          </div>
        ) : mechanics.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No mechanics found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mechanics.map((mechanic) => (
              <MechanicCard key={mechanic._id} mechanic={mechanic} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
                className="border-border"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
                className="border-border"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
