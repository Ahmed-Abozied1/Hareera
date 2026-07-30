import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

// صفحات تحت /admin لكنها للي لسه *مش* داخل — لازم تفضل مفتوحة،
// وإلا صفحة الدخول نفسها بتتحمي من اللي جاي يسجل دخول.
const ADMIN_PUBLIC_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
];

// يجب أن يكون الاسم "proxy" أو export default
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user as
    | { role?: string; isActive?: boolean }
    | undefined;
  const isAdmin = !!user && user.role === 'ADMIN' && user.isActive !== false;

  const isPublicAdminPath = ADMIN_PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // 1. الأدمن الداخل بالفعل ملوش لازمة في صفحة الدخول
  if (isPublicAdminPath) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // 2. إذا كان المستخدم ADMIN ويحاول فتح الصفحة الرئيسية '/'
  if (pathname === '/') {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 3. حماية باقي مسارات الأدمن
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// الـ config يبقى كما هو لتحديد المسارات المستهدفة
export const config = {
  matcher: ['/', '/admin/:path*'],
};
