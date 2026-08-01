"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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

export const HeroBanner = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((current) => (current + 1) % SLIDES.length),
      SLIDE_DURATION
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden aspect-[4/5] md:aspect-[12/5]">
      {SLIDES.map((slide, index) => {
        const isActive = index === active;
        return (
          <div
            key={slide.desktop}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-out",
              isActive ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              className={cn(
                "relative w-full h-full transition-transform ease-out motion-reduce:transition-none motion-reduce:scale-100",
                isActive
                  ? "scale-105 duration-[7000ms]"
                  : "scale-100 duration-1000"
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

      <div className="absolute inset-x-0 bottom-4 md:bottom-6 flex items-center justify-center gap-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.desktop}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`عرض الشريحة ${index + 1}`}
            aria-current={index === active}
            className={cn(
              "h-2 rounded-full bg-white/60 transition-all duration-500 cursor-pointer hover:bg-white",
              index === active ? "w-8 bg-white" : "w-2"
            )}
          />
        ))}
      </div>
    </div>
  );
};
