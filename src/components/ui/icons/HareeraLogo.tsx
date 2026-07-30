import Image from "next/image";
import { cn } from "@/lib/utils";

interface HareeraLogoProps {
  /** الأبعاد الجوهرية — الارتفاع الفعلي بيتحدد من className */
  width?: number;
  height?: number;
  /** أبيض بالكامل، للخلفيات الغامقة زي النافبار والفوتر */
  invert?: boolean;
  priority?: boolean;
  className?: string;
}

/**
 * لوجو حريرا. مصدر واحد لكل الموقع — النافبار والفوتر ولوحة التحكم وشاشات
 * الدخول، عشان متبقاش نسخ متفرقة تسيب حتة ورا لما اللوجو يتغير.
 */
export const HareeraLogo = ({
  width = 200,
  height = 68,
  invert = false,
  priority = false,
  className,
}: HareeraLogoProps) => (
  <Image
    src="/images/logo/hareera-logo.svg"
    alt="Hareera"
    width={width}
    height={height}
    priority={priority}
    unoptimized
    className={cn(
      "w-auto object-contain",
      invert && "brightness-0 invert",
      className
    )}
  />
);
