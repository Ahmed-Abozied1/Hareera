import Image from "next/image";
import Link from "next/link";
import { AppButton } from "@/components/common/AppButton";
import { HERO_CONTENT } from "@/features/home/constants/hero-data";

export const Hero = () => {
  return (
    <section className="w-full bg-brand-soft pt-32 md:pt-36">
      <div className="container">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-sm">
          {/* Mobile banner */}
          <Image
            src="/images/home/header-mobile.webp"
            alt="Hareera — Where Comfort Meets Beauty"
            width={1000}
            height={1250}
            priority
            className="block md:hidden w-full h-auto object-cover"
          />
          {/* Desktop banner */}
          <Image
            src="/images/home/header-desktop.webp"
            alt="Hareera — Where Comfort Meets Beauty"
            width={1920}
            height={800}
            priority
            className="hidden md:block w-full h-auto object-cover"
          />
        </div>

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
