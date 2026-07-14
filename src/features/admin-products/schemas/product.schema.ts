import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  price: z.coerce.number().min(0, "السعر يجب أن يكون أكبر من أو يساوي 0"),
  comparePrice: z.coerce.number().min(0).optional().nullable(),
  category: z.enum(["PAJAMAS", "ROBES"]),
  sizes: z.array(z.string()).min(1, "يجب اختيار مقاس واحد على الأقل"),
  colors: z.array(z.string()).min(1, "يجب إضافة لون واحد على الأقل"),
  stock: z.coerce.number().int().min(0, "المخزون يجب أن يكون 0 أو أكثر"),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  imageUrl: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  imageFile: z.any().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
