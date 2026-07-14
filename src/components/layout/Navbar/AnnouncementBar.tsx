const MESSAGES = [
  "شحن مجاني للطلبات فوق ١٥٠٠ جنيه",
  "الدفع عند الاستلام متاح لكل المحافظات",
  "تشكيلة الساتان الجديدة وصلت الآن",
  "استبدال واسترجاع خلال ١٤ يوم",
];

export const AnnouncementBar = () => {
  const strip = [...MESSAGES, ...MESSAGES];
  return (
    <div className="bg-title text-bg overflow-hidden h-9 flex items-center">
      <div className="animate-marquee whitespace-nowrap flex shrink-0">
        {[...strip, ...strip].map((msg, i) => (
          <span key={i} className="mx-8 text-small-medium inline-flex items-center gap-2">
            <span className="text-secondary">◆</span>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};
