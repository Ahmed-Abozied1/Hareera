"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Archive } from "lucide-react"
import { useOrders } from "../hooks/useOrders"
import { OrdersTable } from "./OrdersTable"
import { OrdersFilters } from "./OrdersFilters"
import { SkeletonTable } from "@/components/common/SkeletonTable"
import { PushNotificationButton } from "@/components/common/PushNotificationButton"

export default function OrdersManagement() {
  const {
    orders,
    isLoading,
    filters,
    currentPage,
    totalPages,
    itemsPerPage,
    resetFilters,
    updateFilter,
    setCurrentPage,
    updateOrderStatus,
    archiveOrder,
    loadingId,
  } = useOrders()

  return (
    <div className="bg-card min-h-screen" dir="rtl">
      <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-3">
        <h2 className="heading-5-bold md:heading-4-bold text-title">إدارة الطلبات</h2>
        <div className="flex items-center gap-3">
          <Link href="/admin/archive">
            <Button variant="outline" className="gap-2 border-amber-400 text-amber-700 hover:bg-amber-50">
              <Archive size={16} />
              <span>الأرشيف</span>
            </Button>
          </Link>
          <PushNotificationButton />
        </div>
      </div>

      <div className="bg-bg rounded-2xl border border-card p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 md:mb-6">
          <OrdersFilters filters={filters} onFilterChange={updateFilter} onReset={resetFilters} />
        </div>

        {isLoading ? (
          <SkeletonTable columns={9} rows={10} />
        ) : (
          <OrdersTable
            orders={orders}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onEdit={(order) => updateOrderStatus(order.id, "RECEIVED")}
            onDelete={archiveOrder}
            loadingId={loadingId}
            isArchiveMode={false}
          />
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-card p-2 md:px-6 md:py-4 mt-4 md:mt-6">
            <span className="text-paragraph text-small-normal md:text-regular-normal">
              الصفحة {currentPage} من {totalPages}
            </span>
            <div className="flex gap-4">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg bg-disabled text-paragraph text-small-bold h-8! md:h-10! px-2! md:px-4! disabled:opacity-50"
              >
                <span className="hidden md:block">السابق</span>
                <ChevronRight className="block md:hidden size-4" />
              </Button>
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg bg-primary text-small-bold h-8! md:h-10! px-2! md:px-4! text-bg disabled:opacity-50"
              >
                <span className="hidden md:block">التالي</span>
                <ChevronLeft className="block md:hidden size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
