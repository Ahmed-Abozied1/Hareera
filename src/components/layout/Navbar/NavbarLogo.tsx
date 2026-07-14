import Image from "next/image";
import Link from "next/link";

export const NavbarLogo = () => (
    <Link href="/" className="flex items-center">
        <Image
            src="/images/logo/logo.jpg"
            alt="Hareera"
            width={112}
            height={112}
            priority
            className="w-11 h-11 md:w-14 md:h-14 object-contain rounded-full block"
        />
    </Link>
);
