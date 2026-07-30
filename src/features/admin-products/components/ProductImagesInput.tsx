"use client";

import { X, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/lib/uploadthing";
import { MAX_PRODUCT_IMAGES } from "@/features/products/constants";

interface ProductImagesInputProps {
  value: string[];
  onChange: (images: string[]) => void;
  error?: { message?: string };
}

/**
 * معرض صور المنتج. أول صورة هي الرئيسية — اللي بتظهر في الكارت وفي السلة —
 * والباقي زوايا وتفاصيل بتتعرض في صفحة المنتج.
 */
export function ProductImagesInput({
  value,
  onChange,
  error,
}: ProductImagesInputProps) {
  const remaining = MAX_PRODUCT_IMAGES - value.length;

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  const makeMain = (url: string) => onChange([url, ...value.filter((u) => u !== url)]);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-medium-medium! text-title">صور المنتج</label>
        <span className="text-small-normal text-paragraph">
          {value.length} / {MAX_PRODUCT_IMAGES}
        </span>
      </div>

      {value.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {value.map((url, i) => (
            <div key={url} className="relative">
              <div
                className={cn(
                  "relative w-24 h-24 rounded-lg overflow-hidden border-2 bg-card",
                  i === 0 ? "border-primary" : "border-border"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={i === 0 ? "الصورة الرئيسية" : `صورة ${i + 1}`}
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => remove(url)}
                  aria-label="حذف الصورة"
                  className="absolute top-1 left-1 w-6 h-6 rounded-full bg-title/70 text-white flex items-center justify-center hover:bg-error transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {i === 0 ? (
                <span className="mt-1 flex items-center justify-center gap-1 text-tiny-normal text-primary font-bold">
                  <Star className="w-3 h-3 fill-primary" />
                  الرئيسية
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeMain(url)}
                  className="mt-1 block w-full text-center text-tiny-normal text-paragraph hover:text-primary cursor-pointer"
                >
                  اجعلها الرئيسية
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {remaining > 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary transition-colors">
          <UploadDropzone
            endpoint="productImage"
            onClientUploadComplete={(res) => {
              const urls = (res ?? [])
                .map((f) => f.url)
                .filter((u): u is string => !!u);

              if (!urls.length) return;

              // مش بنعدي الحد حتى لو المستخدم رفع دفعة أكبر
              const merged = [...value, ...urls.filter((u) => !value.includes(u))];
              onChange(merged.slice(0, MAX_PRODUCT_IMAGES));

              if (merged.length > MAX_PRODUCT_IMAGES) {
                toast.warning(
                  `الحد الأقصى ${MAX_PRODUCT_IMAGES} صور — الزيادة اتجاهلت`
                );
              }
            }}
            onUploadError={(err) => {
              toast.error(`فشل رفع الصورة: ${err.message}`);
            }}
            appearance={{
              container: "border-0 p-0",
              button: "bg-primary text-white rounded-lg px-4 py-2 text-sm",
              label: "text-paragraph text-sm",
              allowedContent: "text-paragraph text-xs",
            }}
          />
        </div>
      ) : (
        <p className="text-small-normal text-paragraph">
          وصلت للحد الأقصى. احذف صورة عشان تضيف غيرها.
        </p>
      )}

      {error && <p className="text-error text-sm">{error.message}</p>}
    </div>
  );
}
