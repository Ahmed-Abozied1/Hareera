"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AppButton } from "@/components/common/AppButton";
import { useModalStore } from "@/store/useModalStore";
import { BodyFigure } from "./BodyFigure";
import { useSizeProfile, DEFAULT_PROFILE } from "../store/useSizeProfile";
import { recommendSize, type SizeProfile } from "../lib/recommend";
import {
  BODY_SHAPES,
  FIT_OPTIONS,
  HEIGHT_RANGE,
  SIZE_CHARTS,
  WEIGHT_RANGE,
  type ProductCategory,
} from "../constants/size-charts";

interface SizeFinderData {
  category?: ProductCategory;
  availableSizes?: string[];
  onPick?: (size: string) => void;
}

const Slider = ({
  id,
  label,
  unit,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-baseline justify-between">
      <label htmlFor={id} className="text-regular-bold text-title">
        {label}
      </label>
      <span className="text-brand-deep font-bold tabular-nums">
        {value} <span className="text-paragraph font-normal text-sm">{unit}</span>
      </span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      dir="ltr"
      className="w-full accent-primary cursor-pointer"
    />
    <div className="flex justify-between text-xs text-loading tabular-nums" dir="ltr">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

const Choice = ({
  active,
  onClick,
  name,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  name: string;
  hint: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "flex flex-col items-center gap-1 rounded-xl border-[1.5px] px-2 py-3 text-center transition-colors cursor-pointer",
      active
        ? "border-primary bg-brand-soft"
        : "border-border hover:border-brand"
    )}
  >
    <span className="text-small-bold text-title">{name}</span>
    <span className="text-xs text-paragraph leading-tight">{hint}</span>
  </button>
);

export const SizeFinderModal = ({ data }: { data?: SizeFinderData }) => {
  const { close } = useModalStore();
  const saved = useSizeProfile((s) => s.profile);
  const setProfile = useSizeProfile((s) => s.setProfile);
  const confirmSize = useSizeProfile((s) => s.confirmSize);

  const category: ProductCategory = data?.category ?? "PAJAMAS";
  const chart = SIZE_CHARTS[category];
  const available = data?.availableSizes?.length
    ? data.availableSizes
    : chart.sizes.map((s) => s.name);

  const [draft, setDraft] = useState<SizeProfile>(saved ?? DEFAULT_PROFILE);

  const patch = (p: Partial<SizeProfile>) => setDraft((d) => ({ ...d, ...p }));

  const result = recommendSize(draft, category, available);

  const apply = () => {
    setProfile(draft);
    if (result.size) {
      confirmSize(category, result.size);
      data?.onPick?.(result.size);
    }
    close();
  };

  return (
    <div className="grid gap-5 md:grid-cols-[240px_1fr] md:gap-6">
      <div className="flex flex-col gap-3">
        <BodyFigure profile={draft} />
        <p className="text-xs text-loading text-center leading-relaxed">
          الأرقام تقديرية من طولك ووزنك — مش قياس بالمازورة.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <Slider
            id="sf-height"
            label="الطول"
            unit="سم"
            value={draft.height}
            min={HEIGHT_RANGE.min}
            max={HEIGHT_RANGE.max}
            onChange={(v) => patch({ height: v })}
          />
          <Slider
            id="sf-weight"
            label="الوزن"
            unit="كجم"
            value={draft.weight}
            min={WEIGHT_RANGE.min}
            max={WEIGHT_RANGE.max}
            onChange={(v) => patch({ weight: v })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-regular-bold text-title">شكل جسمك</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BODY_SHAPES.map((s) => (
              <Choice
                key={s.id}
                active={draft.shape === s.id}
                onClick={() => patch({ shape: s.id })}
                name={s.name}
                hint={s.hint}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-regular-bold text-title">بتحبيها إزاي</h3>
          <div className="grid grid-cols-3 gap-2">
            {FIT_OPTIONS.map((f) => (
              <Choice
                key={f.id}
                active={draft.fit === f.id}
                onClick={() => patch({ fit: f.id })}
                name={f.name}
                hint={`+${chart.ease[f.id]} سم`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-brand bg-brand-soft/60 p-4 flex items-center gap-4">
          <div className="shrink-0 min-w-16 rounded-xl bg-brand-deep px-3 py-2 text-center text-bg heading-5-bold">
            {result.size ?? "—"}
          </div>
          <div className="min-w-0">
            <p className="text-regular-bold text-title">
              {result.outOfRange ? "أوسع مقاس متاح" : "المقاس المقترح"}
            </p>
            <p className="text-small-normal text-paragraph mt-0.5">{result.reason}</p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <AppButton type="button" appVariant="secondary" onClick={close}>
            إلغاء
          </AppButton>
          <AppButton type="button" onClick={apply} isDisabled={!result.size}>
            اختاري {result.size ?? ""}
          </AppButton>
        </div>
      </div>
    </div>
  );
};
