"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/** الشحن داخل مصر بس، فالكود ثابت ومفيش قايمة دول تختاري منها. */
const EGYPT_DIAL_CODE = "+20";

/** الشكل اللي الحقل ده بيخزنه في الفورم. */
type PhoneValue = { country: string; number: string };

interface PhoneInputFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  error?: { message?: string };
  label?: string;
}

export function PhoneInputField<T extends FieldValues>({
  name,
  control,
  error,
  label,
}: PhoneInputFieldProps<T>) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // Controller بيدي القيمة كنوع عام حسب اسم الحقل، فبنضيّقها هنا مرة واحدة
          const value = (field.value as PhoneValue | undefined) || {
            country: EGYPT_DIAL_CODE,
            number: "",
          };

          return (
            <div className="flex items-center w-full overflow-hidden rounded-lg border-[1.5px] border-border focus-within:border-primary transition-colors">
              <div className="shrink-0 flex items-center justify-center gap-1.5 w-24 h-12 bg-muted/40 text-sm font-medium text-title select-none">
                <span aria-hidden>🇪🇬</span>
                <span dir="ltr">{EGYPT_DIAL_CODE}</span>
              </div>

              <div className="w-px self-stretch bg-border" />

              <Input
                dir="ltr"
                type="tel"
                placeholder="أدخل رقم الهاتف"
                value={value.number}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                  // country ثابت مصر حتى لو الحساب متسجل قبل كده بكود تاني
                  field.onChange({
                    country: EGYPT_DIAL_CODE,
                    number: onlyNumbers,
                  });
                }}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12 rounded-none placeholder:text-right!"
              />
            </div>
          );
        }}
      />

      {error && (
        <p className="text-red-500 text-sm text-right!">{error.message}</p>
      )}
    </div>
  );
}