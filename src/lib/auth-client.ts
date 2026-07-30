import { createAuthClient } from "better-auth/react";
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient()],

  // من غير baseURL المكتبة بتكلم نفس الدومين اللي الصفحة مفتوحة منه.
  // كانت متظبطة على NEXT_PUBLIC_APP_URL، وده بيتخبز جوه الجافاسكريبت وقت
  // البناء — فالنسخة المرفوعة على فيرسل كانت بتبعت طلبات الدخول على
  // localhost بتاع الزائر وتفشل. نفس الأوريجن بيشتغل في كل الحالات.
});
