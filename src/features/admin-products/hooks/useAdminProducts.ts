import { useState, useEffect, useCallback } from "react";
import { Product } from "../types/admin-products.types";

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const itemsPerPage = 10;

  const fetchProducts = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      // المسار ده بيرد بـ Cache-Control فيه max-age للمتجر، فمن غير no-store
      // المتصفح بيرجّع نسخته المحفوظة بعد الحذف أو الإضافة والقايمة تبان
      // كأنها ماتغيرتش. الأدمن لازم يشوف الحقيقة على طول.
      const response = await fetch(`/api/products?${params}`, {
        cache: "no-store",
      });
      const data = await response.json();

      const normalized: Product[] = (data.data || []).map((product: Product) => ({
        ...product,
        sizes: product.sizes || [],
        colors: product.colors || [],
        images: product.images || [],
      }));

      setProducts(normalized);
      const total = data.pagination?.total ?? 0;
      setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedRows(checked ? products.map((p) => p.id) : []);
  }, [products]);

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedRows((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  }, []);

  const refetch = useCallback(() => fetchProducts(currentPage), [fetchProducts, currentPage]);

  /**
   * يشيل الصف من القايمة على طول بعد ما السيرفر يأكد الحذف، من غير ما نستنى
   * طلب جديد. كده الحذف بيبان فورًا مهما كان في كاش في النص.
   */
  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
  }, []);

  return {
    products,
    isLoading,
    selectedRows,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    handleSelectAll,
    handleSelectRow,
    refetch,
    removeProduct,
  };
}