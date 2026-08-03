"use client";

import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GOVERNORATES } from "@/features/products/constants";
import { cn } from "@/lib/utils";

interface GovernorateSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  /** لضبط ارتفاع الحقل مع باقي الحقول في الكارد اللي هيتحط فيه. */
  triggerClassName?: string;
}

export const GovernorateSelect = ({
  value,
  onChange,
  label = "المحافظة",
  className,
  triggerClassName,
}: GovernorateSelectProps) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-medium-medium! text-title block">{label}</label>
      )}

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          dir="rtl"
          className={cn(
            "w-full h-12! px-4 rounded-lg border-[1.5px] border-border bg-bg text-title data-placeholder:text-paragraph focus-visible:border-primary focus-visible:ring-0 shadow-none text-medium-normal",
            triggerClassName
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <MapPin className="size-4 shrink-0 text-primary" />
            <SelectValue placeholder="اختاري المحافظة" />
          </span>
        </SelectTrigger>

        <SelectContent
          dir="rtl"
          position="popper"
          className="bg-bg border border-border! max-h-72"
        >
          {GOVERNORATES.map((governorate) => (
            <SelectItem
              key={governorate}
              value={governorate}
              className="cursor-pointer"
            >
              {governorate}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
