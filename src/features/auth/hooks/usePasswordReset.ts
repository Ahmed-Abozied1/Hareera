import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { ResetPasswordFormData } from "../schemas/password.schema";
import { getAuthErrorMessage } from "@/lib/auth-error";
import { toast } from "sonner";
import { useModalStore } from "@/store/useModalStore";

// إعادة تعيين كلمة المرور واحدة للأدمن والمستخدم، فمفيش داعي لتمرير الدور
export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { open } = useModalStore();

  const resetPassword = async (data: ResetPasswordFormData, token: string) => {
    if (isLoading) return false;
    setIsLoading(true);
    try {
      const { error: apiError } = await AuthService.resetPassword(data.password, token);

      if (apiError) {
        toast.error(getAuthErrorMessage(apiError.code));
        setIsLoading(false);
        return false;
      }

      open("PASSWORD_UPDATED_SUCCESS");

      return true;
    } catch {
      toast.error("حدث خطأ غير متوقع");
      setIsLoading(false);
      return false;
    }
  };

  return { resetPassword, isLoading };
};