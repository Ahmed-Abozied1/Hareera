import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import prisma from "./prisma";
import { getAppUrl, getTrustedOrigins } from "./app-url";
import { sendEmail } from "./email";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  // better-auth بيشغّل حد 100 طلب/دقيقة لكل IP في الإنتاج تلقائيًا، وده واسع
  // جدًا لصفحة دخول. القواعد دي بتضيّق الأبواب اللي بتتجرّب فيها كلمات السر.
  // التخزين في الذاكرة (الافتراضي) — على Vercel كل instance ليه عدّاده، فده
  // بيبطّأ التخمين مش بيمنعه بالظبط؛ الدقة الكاملة عايزة storage: "database"
  // وجدول rateLimit في السكيما.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 300, max: 5 },
      "/sign-in/email-otp": { window: 300, max: 5 },
      "/sign-up/email": { window: 3600, max: 5 },
      "/forget-password": { window: 900, max: 3 },
      "/reset-password": { window: 900, max: 5 },
      "/email-otp/send-verification-otp": { window: 900, max: 3 },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,   // 30 يوم
    updateAge: 60 * 60 * 24,         // يجدد الـ session كل يوم تلقائي
    cookieCache: {
      enabled: true,
      // خمس دقايق مش ٣٠ يوم: ده كاش للسيشن جوه الكوكي، ولو طولناه
      // الإيقاف بياخد نفس المدة قبل ما يشتغل، لأن السيرفر مش بيسأل الداتابيز
      maxAge: 60 * 5,
    },
  },

  databaseHooks: {
    session: {
      create: {
        // بوابة واحدة تغطي كل طرق الدخول (إيميل وباسورد، OTP، جوجل):
        // مفيش سيشن بتتعمل لحساب موقوف
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { isActive: true },
          });

          if (user && !user.isActive) {
            throw new APIError("FORBIDDEN", {
              message: "هذا الحساب موقوف. تواصل مع الإدارة.",
              code: "ACCOUNT_DISABLED",
            });
          }
        },
      },
    },
  },
  baseURL: getAppUrl(),
  trustedOrigins: getTrustedOrigins(),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "إعادة تعيين كلمة المرور",
        text: `انقر على الرابط لإعادة تعيين كلمة المرور الخاصة بك: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        input: false,
      },
      // بتتقرا مع السيشن عشان الجارد بيتاع اللوحة يشوفها من غير طلب زيادة
      isActive: {
        type: "boolean",
        input: false,
      },
      image: {
        type: "string",
        required: false,
        input: true, 
      },
    },
  },
  plugins: [
    emailOTP({
      otpLength: 4,
      expiresIn: 300,
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        const subject = type === "email-verification" 
          ? "رمز التحقق من حسابك في Hareera" 
          : "رمز تسجيل الدخول إلى Hareera";
        
        const message = type === "email-verification"
          ? `رمز التحقق الخاص بحسابك هو: ${otp}`
          : `رمز تسجيل الدخول الخاص بك هو: ${otp}`;
        
        await sendEmail({
          to: email,
          subject: subject,
          text: message,
        });
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;