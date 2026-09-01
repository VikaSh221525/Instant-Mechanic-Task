"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking";
import type { BookingFilters } from "@/types/booking";

interface BookingFiltersBarProps {
  filters: BookingFilters;
  onFiltersChange: (filters: BookingFilters) => void;
}

export function BookingFiltersBar({
  filters,
  onFiltersChange,
}: BookingFiltersBarProps) {
  const hasActiveFilters = filters.search || filters.status || filters.sortBy;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search bookings…"
          value={filters.search || ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value, page: 1 })
          }
          className="pl-9 bg-secondary border-border"
        />
      </div>

      {/* Status filter */}
      <Select
        value={filters.status || "ALL"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            status: !value || value === "ALL" ? "" : (value as BookingStatus),
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-[160px] bg-secondary border-border">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value={BookingStatus.PENDING}>Pending</SelectItem>
          <SelectItem value={BookingStatus.ASSIGNED}>Assigned</SelectItem>
          <SelectItem value={BookingStatus.ON_THE_WAY}>On the Way</SelectItem>
          <SelectItem value={BookingStatus.COMPLETED}>Completed</SelectItem>
          <SelectItem value={BookingStatus.CANCELLED}>Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={filters.sortBy || "createdAt"}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, sortBy: value ?? undefined })
        }
      >
        <SelectTrigger className="w-[140px] bg-secondary border-border">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Date</SelectItem>
          <SelectItem value="amount">Amount</SelectItem>
          <SelectItem value="status">Status</SelectItem>
          <SelectItem value="bookingId">Booking ID</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortOrder || "desc"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            sortOrder: (value ?? "desc") as "asc" | "desc",
          })
        }
      >
        <SelectTrigger className="w-[120px] bg-secondary border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest</SelectItem>
          <SelectItem value="asc">Oldest</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onFiltersChange({ page: 1, limit: 20 })
          }
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
