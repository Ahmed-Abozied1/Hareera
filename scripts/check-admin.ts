import prisma from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: {
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      isActive: true,
      accounts: { select: { providerId: true, password: true } },
      sessions: { select: { expiresAt: true } },
    },
  });

  for (const u of users) {
    console.log({
      email: u.email,
      name: u.name,
      role: u.role,
      emailVerified: u.emailVerified,
      isActive: u.isActive,
      providers: u.accounts.map((a) => a.providerId),
      hasPassword: u.accounts.some((a) => !!a.password),
      activeSessions: u.sessions.filter((s) => s.expiresAt > new Date()).length,
    });
  }
}

main().finally(() => prisma.$disconnect());
