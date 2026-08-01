import Link from "next/link";
import { AppButton } from "@/components/common/AppButton";
import { HeroBanner } from "@/features/home/components/Hero/HeroBanner";
import { HERO_CONTENT } from "@/features/home/constants/hero-data";

export const Hero = () => {
  return (
    <section className="w-full bg-brand-soft pt-28 md:pt-29">
      {/* Full-width banner (edge to edge) */}
      <HeroBanner />

      <div className="container">
        <div className="flex flex-col items-center text-center gap-3 py-8 md:py-10">
          <h1 className="heading-4-bold md:heading-2 text-title">
            {HERO_CONTENT.title}
          </h1>
          <p className="text-medium-normal md:text-large-normal text-paragraph max-w-2xl">
            {HERO_CONTENT.description}
          </p>
          <AppButton asChild appVariant="primary" className="px-10 mt-2">
            <Link href={HERO_CONTENT.cta.href}>{HERO_CONTENT.cta.label}</Link>
          </AppButton>
        </div>
      </div>
    </section>
  );
};

export default Hero;
