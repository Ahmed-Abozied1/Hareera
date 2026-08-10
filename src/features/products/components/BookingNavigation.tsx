"use client";

import { AppButton } from "@/components/common/AppButton";

interface BookingNavigationProps {
  currentStep: number;
  handleBack: () => void;
  handleNext: () => void;
  isDisabledNext: boolean;
  isSubmitting?: boolean;
}

export const BookingNavigation = ({
  currentStep,
  handleBack,
  handleNext,
  isDisabledNext,
  isSubmitting = false,
}: BookingNavigationProps) => {
  // الخطوة التانية هي آخر خطوة في الفورم — بعدها بيتبعت الأوردر ويقفل المودال
  const isConfirmStep = currentStep === 2;

  return (
    <div className="flex items-center justify-between gap-1 mt-8">
      <AppButton
        type="button"
        isDisabled={currentStep === 1 || isSubmitting}
        onClick={handleBack}
        className="w-fit bg-disabled text-paragraph"
      >
        السابق
      </AppButton>

      <AppButton
        type="button"
        isLoading={isSubmitting}
        isDisabled={isDisabledNext}
        onClick={handleNext}
        className="w-fit"
      >
        {isConfirmStep ? "تأكيد الطلب" : "التالي"}
      </AppButton>
    </div>
  );
};