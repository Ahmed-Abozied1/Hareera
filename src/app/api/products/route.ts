import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { generateSlug } from "@/lib/slug";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 10)));

    const category = searchParams.get("category");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "newest";
    // لوحة التحكم بتبعت fresh=1. الهيدر العادي public، يعني CDN بتاع Vercel
    // بيخزّن الرد ويرجّعه من غير ما يسأل السيرفر — فالأدمن كان بيشوف منتج
    // محذوف لحد ٦ دقايق. الرابط بالبارامتر ده مفتاح كاش مختلف، وno-store
    // بيمنع تخزينه من أصله.
    const fresh = searchParams.get("fresh") === "1";

    const where: Record<string, unknown> = {};

    if (category === "PAJAMAS" || category === "ROBES") {
      where.category = category;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };

    if (sortBy === "oldest") orderBy = { createdAt: "asc" };
    if (sortBy === "price") orderBy = { price: "asc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          price: true,
          comparePrice: true,
          category: true,
          sizes: true,
          colors: true,
          images: true,
          imageUrl: true,
          stock: true,
          isFeatured: true,
          isNew: true,
          reviewsCount: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      {
        data: products,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
      {
        headers: {
          "Cache-Control": fresh
            ? "no-store"
            : "public, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const validCategories = ["PAJAMAS", "ROBES"];
    const price = Number(body.price);
    const category = body.category || "PAJAMAS";

    if (!body.name?.trim() || !body.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (isNaN(price) || price <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const baseSlug = generateSlug(body.name.trim());
    let slug = baseSlug;
    let suffix = 1;
    while (slug && await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const images: string[] = Array.isArray(body.images) ? body.images : [];
    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        slug: slug || null,
        description: body.description || "",
        price,
        comparePrice: body.comparePrice ? Number(body.comparePrice) : null,
        category,
        sizes: Array.isArray(body.sizes) ? body.sizes : [],
        colors: Array.isArray(body.colors) ? body.colors : [],
        images,
        imageUrl: body.imageUrl || images[0] || null,
        stock: body.stock != null ? Number(body.stock) : 0,
        isFeatured: !!body.isFeatured,
        isNew: body.isNew != null ? !!body.isNew : true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}