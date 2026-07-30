import { getAppUrl } from './app-url';

export async function getData<T>(endpoint: string): Promise<T> {
  // على السيرفر لازم عنوان كامل؛ في المتصفح الأوريجن الحالي بيكفي.
  const baseUrl = typeof window === 'undefined' ? getAppUrl() : '';

  try {
    const response = await fetch(`${baseUrl}/api/${endpoint}`);

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