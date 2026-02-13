import { UserProfile } from "@/types/profile";

export class ProfileService {
  static async updateProfile(
    profile: UserProfile,
    updatedProfile: UserProfile
  ) {
    const response = await fetch(
      `/api/profiles/${encodeURIComponent(profile.phoneNumber)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }
  }

  static async deleteProfile(profile: UserProfile) {
    const response = await fetch(
      `/api/profiles/${encodeURIComponent(profile.phoneNumber)}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete profile");
    }
  }
}
