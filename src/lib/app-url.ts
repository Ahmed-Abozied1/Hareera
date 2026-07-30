/**
 * عنوان الموقع وقت التشغيل.
 *
 * المشكلة اللي بيحلها: NEXT_PUBLIC_APP_URL بتتخبز جوه ملفات الجافاسكريبت وقت البناء.
 * لو اتنسخت من .env المحلي وفيها localhost، الموقع المرفوع يفضل يكلم
 * localhost بتاع الزائر — وده اللي كان بيوقّف تسجيل الدخول على فيرسل.
 *
 * فيرسل بيحط VERCEL_PROJECT_PRODUCTION_URL و VERCEL_URL لوحده، فبنستعملهم
 * كخطة بديلة قبل ما نقع على localhost.
 */

const stripSlash = (url: string) => url.replace(/\/+$/, "");

export function getAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL;

  // بنتجاهل قيمة localhost لو احنا فعلاً شغالين على فيرسل
  const configuredIsLocal = !!configured && /localhost|127\.0\.0\.1/.test(configured);
  if (configured && !(process.env.VERCEL && configuredIsLocal)) {
    return stripSlash(configured);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${stripSlash(process.env.VERCEL_PROJECT_PRODUCTION_URL)}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${stripSlash(process.env.VERCEL_URL)}`;
  }

  return "http://localhost:3000";
}

/** كل العناوين المسموح لها تكلم الـ auth API. */
export function getTrustedOrigins(): string[] {
  const origins = [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
  ].filter((v): v is string => !!v);

  return [...new Set(origins.map(stripSlash))];
}
