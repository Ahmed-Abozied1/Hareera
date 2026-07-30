"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "../schemas/product.schema";
import { useModalStore } from "@/store/useModalStore";
import { toast } from "sonner";
import { AppButton } from "@/components/common/AppButton";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import { FormSelect } from "@/components/common/FormSelect";
import { SizeSelect, ColorsInput } from "./ProductOptionFields";
import { ProductImagesInput } from "./ProductImagesInput";
import { CATEGORIES } from "@/features/products/constants";
import type { Resolver } from "react-hook-form";

type AddModalData = {
  onSuccess?: () => void;
} | undefined;

export function AddProductModal({ data }: { data?: AddModalData }) {
  const { close } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [colors, setColors] = useState<string[]>([]);

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
      name: "",
      description: "",
      price: 0,
      comparePrice: null,
      category: "PAJAMAS",
      sizes: ["S", "M", "L", "XL"],
      colors: [],
      stock: 0,
      isFeatured: false,
      isNew: true,
      imageUrl: "",
    },
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (formData) => {
    // كان بيرجع ساكت والمودال واقف من غير أي رسالة
    if (!images.length) {
      toast.error("لازم تضيف صورة واحدة للمنتج على الأقل");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/products", {
        method: "POST",
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
          imageUrl: images[0],
          images,
        }),
      });

      if (response.ok) {
        toast.success("تمت إضافة المنتج بنجاح");
        data?.onSuccess?.();
        reset();
        setImages([]);
        setSizes(["S", "M", "L", "XL"]);
        setColors([]);
        close();
      } else {
        const error = await response.json().catch(() => ({}));
        toast.error(error?.error || "فشل حفظ المنتج، حاول تاني");
      }
    } catch {
      toast.error("تعذر الاتصال بالسيرفر، حاول تاني");
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
        placeholder="أدخل وصف المنتج"
        rows={4}
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

      <ProductImagesInput
        value={images}
        onChange={(v) => {
          setImages(v);
          setValue("imageUrl", v[0] ?? "");
          setValue("images", v);
        }}
      />

      <div className="flex justify-end gap-2 pt-4">
        <AppButton type="button" appVariant="secondary" onClick={() => { reset(); setImages([]); setSizes(["S", "M", "L", "XL"]); setColors([]); close(); }}>
          إلغاء
        </AppButton>

        <AppButton type="submit" isLoading={isSubmitting}>
          إضافة منتج
        </AppButton>
      </div>
    </form>
  );
}
