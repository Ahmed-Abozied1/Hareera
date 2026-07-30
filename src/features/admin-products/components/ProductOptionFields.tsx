"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIZES } from "@/features/products/constants";

interface FieldError {
  message?: string;
}

/** Toggle chips for selecting available sizes (S/M/L/XL). */
export function SizeSelect({
  value,
  onChange,
  error,
  label = "المقاسات المتاحة",
}: {
  value: string[];
  onChange: (value: string[]) => void;
  error?: FieldError;
  label?: string;
}) {
  const [custom, setCustom] = useState("");

  const toggle = (size: string) => {
    if (value.includes(size)) onChange(value.filter((v) => v !== size));
    else onChange([...value, size]);
  };

  // مقاسات مختارة مش موجودة في القايمة الجاهزة (مثلاً "38" أو "فري سايز")
  const extras = value.filter((v) => !SIZES.includes(v as (typeof SIZES)[number]));

  const addCustom = () => {
    const v = custom.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setCustom("");
  };

  return (
    <div className="space-y-2">
      <label className="text-medium-medium! text-title block">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {[...SIZES, ...extras].map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => toggle(size)}
            className={cn(
              "min-w-12 px-3 h-11 rounded-lg border text-regular-bold transition-colors cursor-pointer",
              value.includes(size)
                ? "bg-primary text-white border-primary"
                : "bg-bg text-title border-border hover:border-primary"
            )}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="مقاس مخصص (مثلاً 38) واضغط Enter"
          className="flex-1 px-4 h-11 text-right border border-border rounded-lg bg-bg text-title placeholder:text-paragraph focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-4 h-11 rounded-lg bg-primary text-white text-regular-medium cursor-pointer"
        >
          إضافة
        </button>
      </div>

      {error && <p className="text-error text-sm">{error.message}</p>}
    </div>
  );
}

/** Tag input for available colors (free text, e.g. أسود، وردي). */
export function ColorsInput({
  value,
  onChange,
  error,
  label = "الألوان المتاحة",
}: {
  value: string[];
  onChange: (value: string[]) => void;
  error?: FieldError;
  label?: string;
}) {
  const [text, setText] = useState("");

  const add = () => {
    const v = text.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setText("");
  };

  const remove = (color: string) => onChange(value.filter((c) => c !== color));

  return (
    <div className="space-y-2">
      <label className="text-medium-medium! text-title block">{label}</label>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="اكتب اللون واضغط Enter"
          className={cn(
            "flex-1 px-4 h-11 text-right border rounded-lg bg-bg text-title placeholder:text-paragraph focus:outline-none focus:ring-2 focus:ring-primary",
            error ? "border-error" : "border-border"
          )}
        />
        <button
          type="button"
          onClick={add}
          className="px-4 h-11 rounded-lg bg-primary text-white text-regular-medium cursor-pointer"
        >
          إضافة
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex gap-2 flex-wrap pt-1">
          {value.map((color) => (
            <span
              key={color}
              className="flex items-center gap-1 bg-card text-title px-3 py-1 rounded-full text-small-medium"
            >
              {color}
              <button type="button" onClick={() => remove(color)} className="cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-error text-sm">{error.message}</p>}
    </div>
  );
}
