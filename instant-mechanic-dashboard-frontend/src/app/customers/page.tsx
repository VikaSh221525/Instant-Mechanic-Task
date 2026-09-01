"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/services/customer.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";
import type { CustomerFilters } from "@/types/customer";

export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFilters>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["customers", filters],
    queryFn: () => getCustomers(filters),
  });

  const customers = data?.data || [];
  const meta = data?.meta;

  return (
    <>
      <Header
        title="Customers"
        subtitle={meta ? `${meta.total} customers` : undefined}
      />
      <div className="p-4 lg:p-8 space-y-6">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers…"
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
            }
            className="pl-9 bg-secondary border-border"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No customers found</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">
                    Name
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      Phone
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Address
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Joined
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow
                    key={customer._id}
                    className="border-border hover:bg-accent/50 transition-colors"
                  >
                    <TableCell className="font-medium text-card-foreground">
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {customer.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                      {customer.address}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {format(new Date(customer.createdAt), "dd MMM yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages} · {meta.total} total
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page <= 1}
                    onClick={() =>
                      setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))
                    }
                    className="border-border"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() =>
                      setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))
                    }
                    className="border-border"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
