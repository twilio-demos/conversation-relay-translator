import { UserProfile } from "@/types/profile";
import { useMutation } from "@tanstack/react-query";

type ProfileUpdate = Partial<UserProfile> & Pick<UserProfile, "phoneNumber">;

async function updateProfile(profile: ProfileUpdate) {
  const res = await fetch(
    `/api/profiles/${encodeURIComponent(profile.phoneNumber)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    }
  );
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export function useUpdateProfile(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
