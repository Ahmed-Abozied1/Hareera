"use client";

import { useMemo } from "react";
import { getShape, estimateBody, type SizeProfile } from "../lib/recommend";

const CX = 130;
const FOOT = 452;

/** نصف العرض عند كل نقطة في وضع متوسط + حساسية كل منطقة للوزن */
const ANCHORS = [
  { y: 104, hw: 36, k: 0.45 },
  { y: 136, hw: 34, k: 0.85, m: "bust" as const },
  { y: 160, hw: 28, k: 0.9 },
  { y: 186, hw: 26, k: 1.25, m: "waist" as const },
  { y: 226, hw: 38, k: 1.0, m: "hip" as const },
  { y: 266, hw: 34, k: 1.05 },
  { y: 334, hw: 24, k: 0.7 },
  { y: 380, hw: 21, k: 0.6 },
  { y: 440, hw: 14, k: 0.4 },
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Catmull-Rom خلال النقط، مكتوبة كمنحنيات بيزيه عشان الشكل يطلع ناعم */
function smooth(points: [number, number][]): string {
  if (!points.length) return "";
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/**
 * سيلويت بيتحسب من الطول والوزن وشكل الجسم — مش صورة بتتبدل.
 * الغرض منه إن العميلة تشوف اختيارها بيتجسّد، مش إنه قياس دقيق.
 */
export const BodyFigure = ({ profile }: { profile: SizeProfile }) => {
  const { bodyPath, armR, armL, armW, heightScale, widths, body } = useMemo(() => {
    const shape = getShape(profile.shape);
    const bmi = profile.weight / Math.pow(profile.height / 100, 2);
    const wf = clamp(1 + (bmi - 22) * 0.028, 0.82, 1.42);

    const widths = ANCHORS.map((a) => {
      let hw = a.hw * (1 + (wf - 1) * a.k);
      if (a.m) hw *= shape[a.m];
      return { ...a, x: hw };
    });

    const right = widths.map((a) => [CX + a.x, a.y] as [number, number]);
    const left = [...widths].reverse().map((a) => [CX - a.x, a.y] as [number, number]);
    const ankle = widths[8];

    const bodyPath =
      smooth(right) +
      ` L ${(CX - ankle.x).toFixed(1)} ${ankle.y}` +
      smooth(left).replace(/^M[^C]*/, " ") +
      " Z";

    const shoulder = widths[0];
    const hip = widths[4];

    return {
      bodyPath,
      armR: `M ${(CX + shoulder.x - 3).toFixed(1)} 110 Q ${(CX + shoulder.x + 15).toFixed(1)} 172 ${(CX + hip.x - 4).toFixed(1)} 232`,
      armL: `M ${(CX - shoulder.x + 3).toFixed(1)} 110 Q ${(CX - shoulder.x - 15).toFixed(1)} 172 ${(CX - hip.x + 4).toFixed(1)} 232`,
      armW: 15 * (1 + (shoulder.x / 36 - 1) * 0.8),
      heightScale: clamp(profile.height / 168, 0.88, 1.1),
      widths,
      body: estimateBody(profile),
    };
  }, [profile]);

  const tapeRows = [
    { label: "الصدر", cm: body.bust, a: widths[1] },
    { label: "الوسط", cm: body.waist, a: widths[3] },
    { label: "الأرداف", cm: body.hip, a: widths[4] },
  ];

  return (
    <div className="rounded-xl bg-card p-2 overflow-hidden">
      <svg viewBox="0 0 260 470" className="block w-full h-auto" role="img" aria-label="شكل تقديري بيتغير مع اختياراتك">
        <defs>
          <linearGradient id="hareeraFigure" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-soft)" />
            <stop offset="100%" stopColor="var(--color-brand)" />
          </linearGradient>
        </defs>

        <g
          transform={`translate(${CX} ${FOOT}) scale(1 ${heightScale.toFixed(3)}) translate(${-CX} ${-FOOT})`}
        >
          <path d={armR} fill="none" stroke="var(--color-brand)" strokeWidth={armW} strokeLinecap="round" />
          <path d={armL} fill="none" stroke="var(--color-brand)" strokeWidth={armW} strokeLinecap="round" />
          <circle cx={CX} cy={50} r={26} fill="url(#hareeraFigure)" />
          <path d={`M ${CX - 9} 72 L ${CX + 9} 72 L ${CX + 11} 106 L ${CX - 11} 106 Z`} fill="url(#hareeraFigure)" />
          <path d={bodyPath} fill="url(#hareeraFigure)" />
        </g>

        {tapeRows.map((r) => {
          const y = FOOT + (r.a.y - FOOT) * heightScale;
          const x1 = CX - r.a.x - 12;
          const x2 = CX + r.a.x + 12;
          return (
            <g key={r.label} stroke="var(--color-brand-deep)" opacity={0.8}>
              <line x1={x1} y1={y} x2={x2} y2={y} strokeWidth={1} strokeDasharray="3 3" />
              <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} strokeWidth={1.5} />
              <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} strokeWidth={1.5} />
              <text
                x={x2 + 7}
                y={y + 4}
                stroke="none"
                fill="var(--color-brand-deep)"
                fontSize={13}
                fontFamily="monospace"
              >
                {r.cm}
              </text>
              <text
                x={x1 - 7}
                y={y + 4}
                stroke="none"
                fill="var(--color-paragraph)"
                fontSize={12}
                textAnchor="end"
              >
                {r.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
