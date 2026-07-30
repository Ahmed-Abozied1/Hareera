/**
 * ينشئ حساب مدير أو يرقّي حساب موجود.
 *
 *   npx tsx --env-file=.env scripts/create-admin.ts <email> <password> [name]
 *
 * البيانات بتتاخد من الأرجومنتس مش مكتوبة جوه الملف، عشان متدخلش جيت.
 * الباسورد بيتهَش بنفس دالة better-auth، فمينفعش نكتبه بأي طريقة تانية.
 */
import { randomUUID } from "crypto";
import { auth } from "../src/lib/auth";
import prisma from "../src/lib/prisma";

async function main() {
  const [email, password, name = "Admin"] = process.argv.slice(2);

  if (!email || !password) {
    console.error(
      "الاستخدام: npx tsx --env-file=.env scripts/create-admin.ts <email> <password> [name]"
    );
    process.exit(1);
  }

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(password);

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: { role: "ADMIN", emailVerified: true, isActive: true },
        select: { id: true, email: true, name: true, role: true },
      })
    : await prisma.user.create({
        data: {
          id: randomUUID(),
          email,
          name,
          role: "ADMIN",
          emailVerified: true, // requireEmailVerification مفعّل، فمن غيرها مش هيعرف يدخل
          isActive: true,
          updatedAt: new Date(),
        },
        select: { id: true, email: true, name: true, role: true },
      });

  const credential = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
    select: { id: true },
  });

  if (credential) {
    await prisma.account.update({
      where: { id: credential.id },
      data: { password: hash, updatedAt: new Date() },
    });
  } else {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hash,
        updatedAt: new Date(),
      },
    });
  }

  console.log(existing ? "تم تحديث الحساب:" : "تم إنشاء الحساب:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
