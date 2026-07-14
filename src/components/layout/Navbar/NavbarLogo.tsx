import Image from "next/image";
import Link from "next/link";

export const NavbarLogo = () => (
    <Link href="/" className="flex items-center">
        <Image
            src="/images/logo/hareera-logo.svg"
            alt="Hareera"
            width={183}
            height={62}
            priority
            unoptimized
            className="h-9 md:h-11 w-auto object-contain brightness-0 invert"
        />
    </Link>
);
