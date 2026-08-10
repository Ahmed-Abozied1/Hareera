import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/get-session"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")))
    const skip = (page - 1) * limit
    const searchTerm = searchParams.get("searchTerm") || ""
    const role = searchParams.get("role") || "all"
    const status = searchParams.get("status") || "all"
    const sortBy = searchParams.get("sortBy") || "newest"
    const getAll = searchParams.get("getAll") === "true"

    const conditions: Prisma.UserWhereInput[] = []
    // الدور جاي من الـ query string، فبنتأكد إنه واحد من قيم الـ enum قبل ما يدخل الاستعلام
    const requestedRole = role.toUpperCase()
    if (requestedRole === "ADMIN" || requestedRole === "USER") {
      conditions.push({ role: requestedRole })
    }
    if (status !== "all") conditions.push({ isActive: status === "active" })
    if (searchTerm) {
      conditions.push({
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
          { phone: { contains: searchTerm, mode: "insensitive" } },
        ],
      })
    }
    const where = conditions.length ? { AND: conditions } : {}

    let orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: "desc" }
    if (sortBy === "name") orderBy = { name: "asc" }
    if (sortBy === "oldest") orderBy = { createdAt: "asc" }

    if (getAll) {
      const allUsers = await prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          role: true,
          createdAt: true,
          _count: {
    select: {
      orders: true // هذا سيجلب إجمالي عدد الطلبات للمستخدم
    }
  }
        },
        orderBy,
      })
      return NextResponse.json({ users: allUsers, total: allUsers.length, totalPages: 1, page: 1 })
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          role: true,
          createdAt: true,
        },
        orderBy,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json(
      { users, totalPages: Math.ceil(total / limit), currentPage: page, totalUsers: total },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    )
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// إيقاف / تنشيط حساب. الإيقاف بيمسح سيشنات المستخدم كمان، وإلا يفضل
// داخل بالسيشن القديمة لحد ما تنتهي.
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const userId = typeof body?.userId === "string" ? body.userId : null
    const isActive = typeof body?.isActive === "boolean" ? body.isActive : null

    if (!userId || isActive === null) {
      return NextResponse.json(
        { error: "userId و isActive مطلوبين" },
        { status: 400 }
      )
    }

    // الأدمن ميقدرش يوقف نفسه — ده أسرع طريق لقفل اللوحة على الكل
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "لا يمكنك إيقاف حسابك الخاص" },
        { status: 400 }
      )
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isActive: true },
    })

    if (!target) {
      return NextResponse.json({ error: "الحساب غير موجود" }, { status: 404 })
    }

    // ولا يوقف آخر أدمن نشط، عشان اللوحة تفضل مفتوحة لحد
    if (!isActive && target.role === "ADMIN") {
      const otherActiveAdmins = await prisma.user.count({
        where: { role: "ADMIN", isActive: true, id: { not: userId } },
      })
      if (otherActiveAdmins === 0) {
        return NextResponse.json(
          { error: "لا يمكن إيقاف آخر مدير نشط" },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, name: true, email: true, isActive: true },
    })

    if (!isActive) {
      await prisma.session.deleteMany({ where: { userId } })
    }

    return NextResponse.json({ user: updated })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}