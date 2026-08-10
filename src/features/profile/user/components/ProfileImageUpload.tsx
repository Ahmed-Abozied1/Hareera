"use client";

import { ImageUpload } from "@/components/common/ImageUpload";
import { getInitials } from "@/lib/getInitials";

interface ProfileImageUploadProps {
  currentImage?: string;
  userName: string;
  isImageUpdating: boolean;
  onImageUpload: (url: string) => Promise<void>;
}

const ProfileImageUpload = ({
  currentImage,
  userName,
  isImageUpdating,
  onImageUpload,
}: ProfileImageUploadProps) => {
  const userInitial = getInitials(userName);

  return (
    <ImageUpload
      currentImage={currentImage}
      onImageUpload={onImageUpload}
      userInitial={userInitial}
      isLoading={isImageUpdating}
    />
  );
};

export default ProfileImageUpload;