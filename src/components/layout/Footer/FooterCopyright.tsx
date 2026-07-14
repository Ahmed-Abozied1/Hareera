import Link from "next/link";

export const FooterCopyright = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="pt-8 mt-8 border-t border-border flex flex-col items-center gap-2 text-center">
      <p className="text-regular-normal">
        الحقوق محفوظة &copy; Hareera {currentYear}
      </p>
      <Link
        href="/admin/login"
        className="text-small-normal text-bg/60 hover:text-bg transition-colors"
      >
        دخول الإدارة
      </Link>
    </div>
  );
};
