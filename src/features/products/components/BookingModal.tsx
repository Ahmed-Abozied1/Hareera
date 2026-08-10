"use client";

import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { BookingStepper } from "./BookingStepper";
import { BookingNavigation } from "./BookingNavigation";
import { UserDataForm } from "./UserDataForm";
import { OrderSummary } from "./OrderSummary";
import { toast } from "sonner";
import { useSession } from "@/features/auth/hooks/useAuth";
import { CartItem, PhoneObject } from "../types/product.types";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { CHECKOUT_STEPS } from "../constants";
import { purchase } from "@/lib/pixel";

export const BookingModal = () => {
  // المودال ده بيتركّب وقت الفتح بس، فمفيش داعي نصفّر الحقول عند القفل — بيتفكّ خلاص
  const { close, data, open } = useModalStore();
  const modalData = data as CartItem | null;
  const { data: session } = useSession();
  const { createOrder, isSubmitting, error } = useCreateOrder();

  const [currentStep, setCurrentStep] = useState(1);
  // null معناها "المستخدمة ما كتبتش حاجة لسه"، فبنعرض بيانات حسابها لحد ما تعدّل
  const [typedName, setTypedName] = useState<string | null>(null);
  const [typedPhone, setTypedPhone] = useState<PhoneObject | null>(null);
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const activeSteps = CHECKOUT_STEPS;

  const sessionUser = session?.user;
  const name = typedName ?? sessionUser?.name ?? "";
  const phone =
    typedPhone ??
    (typeof sessionUser?.phone === "string"
      ? { country: "+20", number: sessionUser.phone.replace(/[^0-9]/g, "") }
      : { country: "+20", number: "" });

  const handleSubmitOrder = async () => {
    if (!modalData) return;

    const phoneString = `${phone.country}${phone.number}`;
    const safeQuantity = Math.max(1, Math.floor(modalData.quantity || 1));

    const payload = {
      productId: modalData.productId,
      size: modalData.size,
      color: modalData.color,
      quantity: safeQuantity,
      price: modalData.price,
      customerName: name,
      phone: phoneString,
      governorate,
      address,
      notes: notes || undefined,
    };

    const result = await createOrder(payload);

    if (result) {
      purchase({
        content_name: modalData.productName,
        content_ids: [modalData.productId],
        value: modalData.price * safeQuantity,
        num_items: safeQuantity,
      });
      close();
      open("BOOKING_SUCCESS");
    } else {
      toast.error(error || "فشل في إنشاء الطلب");
    }
  };

  const handleNext = async () => {
    const isDataStep = currentStep === 1;
    const isSummaryStep = currentStep === 2;

    if (isDataStep && (!name || !phone.number || !governorate || !address.trim())) {
      toast.error("يرجى ملء جميع بيانات الشحن المطلوبة");
      return;
    }

    if (isDataStep && phone.number.length < 8) {
      toast.error("رقم الهاتف يجب أن يكون 8 أرقام على الأقل");
      return;
    }

    if (isSummaryStep) {
      await handleSubmitOrder();
      return;
    }

    const lastStep = 2;
    if (currentStep < lastStep) setCurrentStep((p) => p + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };

  const isNextDisabled = () => {
    if (isSubmitting) return true;
    if (currentStep === 1)
      return !name || !phone.number || phone.number.length < 8 || !governorate || !address.trim();
    return false;
  };

  const getCurrentStepContent = () => {
    if (currentStep === 1) {
      return (
        <UserDataForm
          name={name}
          setName={setTypedName}
          phone={phone}
          setPhone={setTypedPhone}
          governorate={governorate}
          setGovernorate={setGovernorate}
          address={address}
          setAddress={setAddress}
          notes={notes}
          setNotes={setNotes}
        />
      );
    }

    return (
      <OrderSummary
        data={modalData}
        name={name}
        phone={phone}
        governorate={governorate}
        address={address}
      />
    );
  };

  return (
    <div className="flex flex-col">
      <BookingStepper currentStep={currentStep} steps={activeSteps} />

      {getCurrentStepContent()}

      <BookingNavigation
        currentStep={currentStep}
        handleBack={handleBack}
        handleNext={handleNext}
        isDisabledNext={isNextDisabled()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
