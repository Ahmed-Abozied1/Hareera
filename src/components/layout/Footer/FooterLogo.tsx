import Image from "next/image";
import Link from "next/link";

export const FooterLogo = () => {
    return (
        <Link href="/" className="mb-4 md:mb-6 flex justify-center">
            <Image
                src="/images/logo/logo.jpg"
                alt="Hareera"
                width={160}
                height={160}
                className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-full bg-white p-1"
            />
        </Link>
    );
};