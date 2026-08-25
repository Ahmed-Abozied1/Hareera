import { getAppUrl } from './app-url';

/**
 * @param fresh لقوايم لوحة التحكم. مسارات الـ API بتبعت Cache-Control فيه
 * max-age، فمن غيرها المتصفح بيرجّع نسخته المحفوظة بعد أي حذف أو تعديل
 * والقايمة تبان كأنها ماتغيرتش. المتجر بيستفيد من الكاش، الأدمن لأ.
 */
export async function getData<T>(endpoint: string, fresh = false): Promise<T> {
  // على السيرفر لازم عنوان كامل؛ في المتصفح الأوريجن الحالي بيكفي.
  const baseUrl = typeof window === 'undefined' ? getAppUrl() : '';

  try {
    const response = await fetch(
      `${baseUrl}/api/${endpoint}`,
      fresh ? { cache: 'no-store' } : undefined
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'حدث خطأ غير متوقع',
      }));

      throw new Error(error.error || 'حدث خطأ أثناء جلب البيانات');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'تعذر الاتصال بالسيرفر، حاول مرة أخرى'
    );
  }
}