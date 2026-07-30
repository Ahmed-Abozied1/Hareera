"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  /** المودال اللي نرجّعه لما نخلص — الكويك فيو بيتقفل لما نفتح ده فوقه */
  returnTo?: { view: string; data?: unknown };
}

const STEPS = [
  { id: 1, label: "طولك ووزنك" },
  { id: 2, label: "شكل جسمك" },
  { id: 3, label: "القَصّة" },
  { id: 4, label: "مقاسك" },
];

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
      active ? "border-primary bg-brand-soft" : "border-border hover:border-brand"
    )}
  >
    <span className="text-small-bold text-title">{name}</span>
    <span className="text-xs text-paragraph leading-tight">{hint}</span>
  </button>
);

export const SizeFinderModal = ({ data }: { data?: SizeFinderData }) => {
  const { close, open } = useModalStore();
  const saved = useSizeProfile((s) => s.profile);
  const setProfile = useSizeProfile((s) => s.setProfile);
  const confirmSize = useSizeProfile((s) => s.confirmSize);

  const category: ProductCategory = data?.category ?? "PAJAMAS";
  const chart = SIZE_CHARTS[category];
  const available = data?.availableSizes?.length
    ? data.availableSizes
    : chart.sizes.map((s) => s.name);

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<SizeProfile>(saved ?? DEFAULT_PROFILE);

  const patch = (p: Partial<SizeProfile>) => setDraft((d) => ({ ...d, ...p }));
  const result = recommendSize(draft, category, available);

  const leave = () => {
    if (data?.returnTo) open(data.returnTo.view, data.returnTo.data);
    else close();
  };

  const finish = () => {
    setProfile(draft);
    if (result.size) {
      confirmSize(category, result.size);
      data?.onPick?.(result.size);
    }
    leave();
  };

  const isLast = step === STEPS.length;

  return (
    <div className="grid gap-5 md:grid-cols-[220px_1fr] md:gap-6">
      {/* الشكل ثابت في كل الخطوات — هو اللي بيخلي الاختيارات محسوسة */}
      <div className="flex flex-col gap-2">
        <BodyFigure profile={draft} />
        <p className="text-xs text-loading text-center leading-relaxed">
          الأرقام تقديرية من طولك ووزنك — مش قياس بالمازورة.
        </p>
      </div>

      <div className="flex flex-col gap-5 min-h-80">
        {/* مؤشر الخطوات */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            {STEPS.map((s) => (
              <span
                key={s.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  s.id <= step ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-regular-bold text-title">{STEPS[step - 1].label}</h3>
            <span className="text-xs text-loading tabular-nums">
              {step} / {STEPS.length}
            </span>
          </div>
        </div>

        <div className="flex-1">
          {step === 1 && (
            <div className="flex flex-col gap-5">
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
          )}

          {step === 2 && (
            <div className="flex flex-col gap-2">
              <p className="text-small-normal text-paragraph">
                ده بيظبط القَصّة المناسبة ليكي، مش المقاس.
              </p>
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
          )}

          {step === 3 && (
            <div className="flex flex-col gap-2">
              <p className="text-small-normal text-paragraph">
                في الهوم وير ده بيغيّر التوصية مقاس كامل.
              </p>
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
          )}

          {step === 4 && (
            <div className="flex flex-col gap-3">
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

              <dl className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["الصدر", result.body.bust],
                  ["الوسط", result.body.waist],
                  ["الأرداف", result.body.hip],
                ].map(([label, cm]) => (
                  <div key={label as string} className="rounded-lg bg-card py-2">
                    <dt className="text-xs text-loading">{label}</dt>
                    <dd className="text-regular-bold text-title tabular-nums">
                      {cm} <span className="text-xs font-normal text-loading">سم</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-between items-center">
          <button
            type="button"
            onClick={() => (step === 1 ? leave() : setStep(step - 1))}
            className="flex items-center gap-1 text-small-bold text-paragraph hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            {step === 1 ? "إلغاء" : "السابق"}
          </button>

          {isLast ? (
            <AppButton type="button" onClick={finish} isDisabled={!result.size}>
              اختاري {result.size ?? ""}
            </AppButton>
          ) : (
            <AppButton type="button" onClick={() => setStep(step + 1)}>
              <span className="flex items-center gap-1">
                التالي
                <ChevronLeft className="w-4 h-4" />
              </span>
            </AppButton>
          )}
        </div>
      </div>
    </div>
  );
};
