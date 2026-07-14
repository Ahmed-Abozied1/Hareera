import Image from "next/image";
import Link from "next/link";

export const FooterLogo = () => {
    return (
        <Link href="/" className="mb-4 md:mb-6 flex justify-center">
            <Image
                src="/images/logo/hareera-logo.svg"
                alt="Hareera"
                width={240}
                height={82}
                unoptimized
                className="h-14 md:h-16 w-auto object-contain brightness-0 invert"
            />
        </Link>
    );
};
