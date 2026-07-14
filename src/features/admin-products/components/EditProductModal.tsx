"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "../schemas/product.schema";
import { Product } from "../types/admin-products.types";
import { useModalStore } from "@/store/useModalStore";
import { toast } from "sonner";
import { AppButton } from "@/components/common/AppButton";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import { FormSelect } from "@/components/common/FormSelect";
import { UploadDropzone } from "@/lib/uploadthing";
import { SizeSelect, ColorsInput } from "./ProductOptionFields";
import { CATEGORIES } from "@/features/products/constants";
import type { Resolver } from "react-hook-form";

interface EditProductModalProps {
  data: { product: Product; onSuccess?: () => void };
}

export function EditProductModal({ data }: EditProductModalProps) {
  const { close } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(data.product.imageUrl || "");
  const [sizes, setSizes] = useState<string[]>(data.product.sizes || []);
  const [colors, setColors] = useState<string[]>(data.product.colors || []);

  const resolver = zodResolver(productSchema) as unknown as Resolver<ProductFormData>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver,
    defaultValues: {
      name: data.product.name,
      description: data.product.description,
      price: data.product.price,
      comparePrice: data.product.comparePrice ?? null,
      category: data.product.category,
      sizes: data.product.sizes || [],
      colors: data.product.colors || [],
      stock: data.product.stock ?? 0,
      isFeatured: data.product.isFeatured ?? false,
      isNew: data.product.isNew ?? true,
      imageUrl: data.product.imageUrl || "",
    },
  });

  useEffect(() => {
    if (data.product) {
      reset({
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        comparePrice: data.product.comparePrice ?? null,
        category: data.product.category,
        sizes: data.product.sizes || [],
        colors: data.product.colors || [],
        stock: data.product.stock ?? 0,
        isFeatured: data.product.isFeatured ?? false,
        isNew: data.product.isNew ?? true,
        imageUrl: data.product.imageUrl || "",
      });
      setImageUrl(data.product.imageUrl || "");
      setSizes(data.product.sizes || []);
      setColors(data.product.colors || []);
    }
  }, [data.product, reset]);

  const onSubmit: SubmitHandler<ProductFormData> = async (formData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/products/${data.product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
          category: formData.category,
          sizes,
          colors,
          stock: Number(formData.stock),
          isFeatured: formData.isFeatured,
          isNew: formData.isNew,
          imageUrl: imageUrl || null,
          images: imageUrl ? [imageUrl] : [],
        }),
      });

      if (response.ok) {
        toast.success("تم تحديث المنتج بنجاح");
        data.onSuccess?.();
        close();
      } else {
        const body = await response.json().catch(() => ({}));
        toast.error(body?.error || "فشل تحديث المنتج");
      }
    } catch {
      toast.error("حدث خطأ، تحقق من اتصالك وحاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        name="name"
        label="الاسم"
        register={register}
        error={errors.name}
        placeholder="أدخل اسم المنتج"
      />

      <FormTextarea
        name="description"
        label="الوصف"
        register={register}
        error={errors.description}
        rows={4}
        placeholder="أدخل وصف المنتج"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          name="price"
          label="السعر (ج.م)"
          type="number"
          register={register}
          error={errors.price}
          placeholder="أدخل السعر"
        />

        <FormInput
          name="comparePrice"
          label="السعر قبل الخصم (اختياري)"
          type="number"
          register={register}
          error={errors.comparePrice}
          placeholder="اتركه فارغاً لو مفيش خصم"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          name="category"
          label="القسم"
          register={register}
          error={errors.category}
          options={CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
        />

        <FormInput
          name="stock"
          label="المخزون"
          type="number"
          register={register}
          error={errors.stock}
          placeholder="الكمية المتاحة"
        />
      </div>

      <SizeSelect value={sizes} onChange={(v) => { setSizes(v); setValue("sizes", v); }} error={errors.sizes} />

      <ColorsInput value={colors} onChange={(v) => { setColors(v); setValue("colors", v); }} error={errors.colors} />

      <div className="flex gap-6 pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-title text-regular-medium">
          <input type="checkbox" {...register("isNew")} className="w-4 h-4 accent-primary" />
          وصل حديثاً
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-title text-regular-medium">
          <input type="checkbox" {...register("isFeatured")} className="w-4 h-4 accent-primary" />
          منتج مميز
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-medium-medium! text-title">صورة المنتج</label>

        <div className="flex gap-4 items-start">
          {imageUrl && (
            <div className="shrink-0">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Current product"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <button
                type="button"
                onClick={() => { setImageUrl(""); setValue("imageUrl", ""); }}
                className="text-red-500 text-xs hover:text-red-600 mt-1 block"
              >
                إزالة
              </button>
            </div>
          )}

          <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary transition-colors flex-1">
            <UploadDropzone
              endpoint="productImage"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) {
                  setImageUrl(res[0].url);
                  setValue("imageUrl", res[0].url);
                }
              }}
              onUploadError={(error) => {
                console.error("Upload error:", error);
              }}
              appearance={{
                container: "border-0 p-0",
                button: "bg-primary text-white rounded-lg px-4 py-2 text-sm",
                label: "text-paragraph text-sm",
                allowedContent: "text-paragraph text-xs",
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <AppButton type="button" appVariant="secondary" onClick={close}>
          إلغاء
        </AppButton>
        <AppButton type="submit" isLoading={isSubmitting || uploading}>
          {uploading ? "جاري رفع الصورة..." : isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
        </AppButton>
      </div>
    </form>
  );
}
