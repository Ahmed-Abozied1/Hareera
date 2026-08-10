"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profileStore";
import { useSession } from "@/features/auth/hooks/useAuth";
import { profileService } from "@/features/common/profile.service";
import { getErrorMessage } from "@/lib/utils";

export const useProfile = () => {
  const { data: session, refetch } = useSession();
  const { user, setUser, updateUser, setIsLoading } = useProfileStore();
  const [isImageUpdating, setIsImageUpdating] = useState(false);

  useEffect(() => {
    const sessionUser = session?.data?.user; // ✅ FIXED

    if (sessionUser) {
      setUser(sessionUser);
    }

    setIsLoading(false);
  }, [session, setUser, setIsLoading]);

  const handleImageUpload = async (url: string) => {
    if (!user) return;

    setIsImageUpdating(true);

    try {
      await profileService.updateProfileImage(url);
      await refetch();

      updateUser({ image: url });

      toast.success("تم تحديث الصورة بنجاح");
    } catch (error) {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث الصورة"));
    } finally {
      setIsImageUpdating(false);
    }
  };

  // مفيش حذف صورة في بروفايل المستخدمة — الزرار موجود في بروفايل الأدمن بس
  return {
    user,
    isImageUpdating,
    handleImageUpload,
    refetch,
  };
};