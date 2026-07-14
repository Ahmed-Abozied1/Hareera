import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { OrderStatus } from "@/generated/prisma/enums";
import { sendPushToAdmins } from "@/lib/push";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 10)));
    const skip = (page - 1) * limit;

    const searchTerm = searchParams.get("searchTerm") || "";
    const status = searchParams.get("status") || "all";
    const sortBy = searchParams.get("sortBy") || "newest";

    const archived = searchParams.get("archived") === "true";
    const where: Record<string, unknown> = { isArchived: archived };

    if (status !== "all") {
      where.status = status;
    }

    if (searchTerm) {
      const orderNumber = Number(searchTerm);

      where.OR = [
        ...(!isNaN(orderNumber) ? [{ orderNumber }] : []),
        {
          customerName: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          phone: { contains: searchTerm, mode: "insensitive" },
        },
        {
          product: {
            name: { contains: searchTerm, mode: "insensitive" },
          },
        },
      ];
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };

    if (sortBy === "name") {
      orderBy = { customerName: "asc" };
    } else if (sortBy === "oldest") {
      orderBy = { createdAt: "asc" };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: {
            select: {
              name: true,
              category: true,
              price: true,
              imageUrl: true,
            },
          },
          user: {
            select: {
              email: true,
              phone: true,
            },
          },
        },
        orderBy,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json(
      { orders, totalPages: Math.ceil(total / limit), currentPage: page, totalOrders: total },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminSession = await getServerSession();
    const isAdmin = adminSession?.user?.role === "ADMIN";

    if (!isAdmin) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
      const { allowed } = await rateLimit(ip);
      if (!allowed) {
        return NextResponse.json({ error: "طلبات كثيرة، حاول بعد دقيقة" }, { status: 429 });
      }
    }

    const body = await request.json();

    const {
      productId,
      size,
      color,
      customerName,
      phone,
      governorate,
      address,
      notes,
      quantity = 1,
    } = body;

    const parsedQty = Number(quantity);

    if (!productId || !size || !color || !customerName?.trim() || !phone || !governorate || !address?.trim()) {
      return NextResponse.json({ error: "بيانات مطلوبة ناقصة" }, { status: 400 });
    }
    if (!Number.isInteger(parsedQty) || parsedQty < 1 || parsedQty > 100) {
      return NextResponse.json({ error: "الكمية غير صحيحة" }, { status: 400 });
    }

    // Fetch price from DB — never trust client-supplied price
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { price: true, sizes: true, colors: true },
    });
    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }
    if (product.sizes.length && !product.sizes.includes(size)) {
      return NextResponse.json({ error: "المقاس غير متاح" }, { status: 400 });
    }
    if (product.colors.length && !product.colors.includes(color)) {
      return NextResponse.json({ error: "اللون غير متاح" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const hasSession = cookieStore.has("better-auth.session_token");
    const session = hasSession ? await getServerSession() : null;

    const FREE_SHIPPING_THRESHOLD = 1500;
    const SHIPPING_COST = 60;
    const unitPrice = product.price;
    const subtotal = Math.round(unitPrice * parsedQty * 100) / 100;
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totalPrice = Math.round((subtotal + shippingCost) * 100) / 100;

    const order = await prisma.order.create({
      data: {
        ...(session?.user?.id ? { userId: session.user.id } : {}),
        productId,
        size,
        color,
        customerName: customerName.trim(),
        phone,
        governorate,
        address: address.trim(),
        notes: notes?.trim() || null,
        quantity: parsedQty,
        unitPrice,
        shippingCost,
        totalPrice,
        paymentMethod: "COD",
        status: OrderStatus.PENDING,
      },
    });

    sendPushToAdmins(
      "طلب جديد",
      `${customerName} — #${order.orderNumber}`
    ).catch(() => {});

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الطلب" },
      { status: 500 }
    );
  }
}