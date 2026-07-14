"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalHeader } from "./ModalHeader";
import { useEffect } from "react";
import { FormInput } from "@/components/common/FormInput";
import { PhoneInputField } from "@/components/common/PhoneInput";
import { GOVERNORATES } from "../constants";

interface UserDataFormProps {
  name: string;
  setName: (value: string) => void;
  phone: { country: string; number: string };
  setPhone: (value: { country: string; number: string }) => void;
  governorate: string;
  setGovernorate: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.object({
    country: z.string(),
    number: z
      .string()
      .min(8, "رقم الهاتف قصير جداً")
      .max(15, "رقم الهاتف طويل جداً")
      .regex(/^[0-9]+$/, "يجب أن يحتوي على أرقام فقط")
      .refine((val) => val[0] !== "0", {
        message: "رقم الهاتف لا يبدأ بـ 0",
      }),
  }),
});

type FormData = z.infer<typeof formSchema>;

export const UserDataForm = ({
  name,
  setName,
  phone,
  setPhone,
  governorate,
  setGovernorate,
  address,
  setAddress,
  notes,
  setNotes,
}: UserDataFormProps) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: name || "",
      phone: phone || { country: "+20", number: "" },
    },
  });

  const watchedName = watch("name");
  const watchedPhone = watch("phone");

  useEffect(() => {
    if (watchedName !== undefined && watchedName !== name) {
      setName(watchedName || "");
    }
  }, [watchedName]);

  useEffect(() => {
    if (watchedPhone !== undefined && watchedPhone !== phone) {
      setPhone(watchedPhone || { country: "+20", number: "" });
    }
  }, [watchedPhone]);

  return (
    <div className="flex-1" dir="rtl">
      <ModalHeader
        title="بيانات الشحن"
        description="اكتبي بياناتك بدقة عشان الأوردر يوصلك صح — الدفع عند الاستلام."
      />

      <div className="space-y-4">
        <FormInput
          name="name"
          label="الاسم بالكامل"
          register={register}
          error={errors.name}
          placeholder="أدخلي الاسم بالكامل"
        />

        <PhoneInputField
          name="phone"
          control={control}
          error={errors.phone}
          label="رقم الهاتف / الواتساب"
        />

        <div className="space-y-1.5">
          <label className="text-medium-medium! text-title block">المحافظة</label>
          <select
            value={governorate}
            onChange={(e) => setGovernorate(e.target.value)}
            className="w-full h-12 px-4 text-right border border-border rounded-lg bg-bg text-title focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">اختاري المحافظة</option>
            {GOVERNORATES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-medium-medium! text-title block">العنوان بالتفصيل</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="المدينة، الشارع، رقم العقار، علامة مميزة..."
            className="w-full px-4 py-3 text-right border border-border rounded-lg bg-bg text-title placeholder:text-paragraph focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-medium-medium! text-title block">ملاحظات (اختياري)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="أي ملاحظة إضافية على الأوردر"
            className="w-full px-4 py-3 text-right border border-border rounded-lg bg-bg text-title placeholder:text-paragraph focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
      </div>
    </div>
  );
};
