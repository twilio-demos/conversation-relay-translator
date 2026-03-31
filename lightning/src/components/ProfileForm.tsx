"use client";

import { ProfileFormFormik } from "@/app/components/forms/profile-form-formik";
import { UserProfile } from "@/types/profile";

interface ProfileFormProps {
  profile?: UserProfile;
  onSubmit: (profile: UserProfile) => Promise<void>;
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  return <ProfileFormFormik profile={profile} onSubmit={onSubmit} />;
}
