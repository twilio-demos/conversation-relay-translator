import { ProfileService } from "@/lib/services/profile";
import { UserProfile } from "@/types/profile";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useProfile = (profile: UserProfile) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleUpdate = async (updatedProfile: UserProfile) => {
    try {
      await ProfileService.updateProfile(profile, updatedProfile);
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete ${profile.name}'s profile?`)
    ) {
      return;
    }
    try {
      setIsDeleting(true);
      await ProfileService.deleteProfile(profile);
      router.push("/profiles");
    } catch (error) {
      alert("Failed to delete profile. Please try again.");
      setIsDeleting(false);
    }
  };

  return { isEditing, setIsEditing, isDeleting, handleUpdate, handleDelete };
};
