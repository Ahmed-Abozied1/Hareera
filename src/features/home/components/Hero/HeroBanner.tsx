"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_CONTENT } from "@/features/home/constants/hero-data";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    mobile: "/images/home/header-mobile.webp",
    desktop: "/images/home/header-desktop.webp",
    alt: "Hareera — Where Comfort Meets Beauty",
  },
  {
    mobile: "/images/home/header2-mobile.webp",
    desktop: "/images/home/header2-desktop.webp",
    alt: "Hareera — تشكيلة جديدة",
  },
];

const SLIDE_DURATION = 6000;
const CONTROLS_LINGER = 3000;

// Hidden and untappable until hovered (desktop) or the banner is tapped (touch)
const ARROW_CLASSES =
  "absolute z-10 top-1/2 -translate-y-1/2 grid place-items-center size-10 md:size-12 rounded-full bg-white/70 hover:bg-white text-title shadow-md md:backdrop-blur-sm cursor-pointer transition-all duration-300 opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto";
const ARROW_VISIBLE = "opacity-100 pointer-events-auto";

export const HeroBanner = () => {
  const [active, setActive] = useState(0);
  // Touch devices have no hover, so a tap on the banner reveals the arrows
  const [touchControls, setTouchControls] = useState(false);
  const hideControls = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number) => setActive((index + SLIDES.length) % SLIDES.length),
    []
  );

  const revealControls = useCallback(() => {
    setTouchControls(true);
    if (hideControls.current) clearTimeout(hideControls.current);
    hideControls.current = setTimeout(
      () => setTouchControls(false),
      CONTROLS_LINGER
    );
  }, []);

  useEffect(
    () => () => {
      if (hideControls.current) clearTimeout(hideControls.current);
    },
    []
  );

  // Restarts on every change, so a click always gets a full slide to breathe
  useEffect(() => {
    const timer = setTimeout(
      () => setActive((current) => (current + 1) % SLIDES.length),
      SLIDE_DURATION
    );
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <div className="w-full">
      <div
        onTouchStart={revealControls}
        className="relative w-full overflow-hidden aspect-[4/5] md:aspect-[12/5] group"
      >
        {SLIDES.map((slide, index) => {
          const isActive = index === active;
          return (
            <div
              key={slide.desktop}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-out transform-gpu",
                isActive ? "opacity-100" : "opacity-0"
              )}
            >
              <div
                className={cn(
                  "relative w-full h-full transition-transform ease-out transform-gpu will-change-transform motion-reduce:transition-none motion-reduce:scale-100",
                  isActive
                    ? // زووم أهدأ على الموبايل، الصورة طويلة فنفس النسبة بتبان أكتر
                      "scale-[1.025] md:scale-105 duration-[7000ms]"
                    : // يرجع لحجمه بعد ما يختفي خالص، مش وهو بيختفي — من غير كده
                      // الصورتين بيتحركوا عكس بعض في نفس اللحظة وبتبان كهزة
                      "scale-100 duration-0 delay-[1200ms]"
                )}
              >
                {/* Mobile banner */}
                <Image
                  src={slide.mobile}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="block md:hidden object-cover"
                />
                {/* Desktop banner */}
                <Image
                  src={slide.desktop}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="hidden md:block object-cover"
                />
              </div>
            </div>
          );
        })}

        {/* زرار SHOP NOW مرسوم جوه الصورة نفسها ومش قابل للضغط، فالبانر كله
            بقى لينك للمتجر — الزبونة بتدوس على الزرار اللي شايفاه وبيشتغل.
            جاي قبل الأسهم عشان الأسهم تفضل فوقه في ترتيب الطبقات. */}
        <Link
          href={HERO_CONTENT.cta.href}
          aria-label={HERO_CONTENT.cta.label}
          className="absolute inset-0"
        />

        {/* Side arrows — start is the right edge in RTL */}
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="الشريحة السابقة"
          className={cn(
            ARROW_CLASSES,
            touchControls && ARROW_VISIBLE,
            "start-3 md:start-6"
          )}
        >
          <ChevronRight className="size-5 md:size-6" />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="الشريحة التالية"
          className={cn(
            ARROW_CLASSES,
            touchControls && ARROW_VISIBLE,
            "end-3 md:end-6"
          )}
        >
          <ChevronLeft className="size-5 md:size-6" />
        </button>
      </div>

      {/* Dots sit under the banner so they never cross the artwork */}
      <div className="flex items-center justify-center gap-2 pt-4">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.desktop}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`عرض الشريحة ${index + 1}`}
            aria-current={index === active}
            className={cn(
              "h-2 rounded-full transition-all duration-500 cursor-pointer",
              index === active
                ? "w-8 bg-primary"
                : "w-2 bg-title/25 hover:bg-title/40"
            )}
          />
        ))}
      </div>
    </div>
  );
};
