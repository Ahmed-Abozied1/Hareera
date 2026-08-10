export const FooterCopyright = () => {
  const currentYear = new Date().getFullYear();

  // مفيش لينك للوحة الإدارة هنا عن قصد — الزباين ملهمش لازمة بيه، وعرضه في
  // كل صفحة بيدل البوتات على باب الدخول. الدخول من /admin مباشرة.
  return (
    <div className="pt-8 mt-8 border-t border-border flex flex-col items-center gap-2 text-center">
      <p className="text-regular-normal">
        الحقوق محفوظة &copy; Hareera {currentYear}
      </p>
    </div>
  );
};
