"use client";

import { ProfileForm } from "@/components/ProfileForm";
import { UserProfile } from "@/types/profile";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type ClientProfilePageProps = {
  profile: UserProfile;
};

export default function ClientProfilePage({ profile }: ClientProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleUpdate = async (updatedProfile: UserProfile) => {
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

    setIsEditing(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete ${profile.name}'s profile?`)
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/profiles/${encodeURIComponent(profile.phoneNumber)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete profile");
      }

      router.push("/profiles");
    } catch (error) {
      alert("Failed to delete profile. Please try again.");
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/profiles"
            className="text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to Profiles
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Edit Profile
        </h1>
        <ProfileForm profile={profile} onSubmit={handleUpdate} />
        <button
          onClick={() => setIsEditing(false)}
          className="mt-4 text-gray-600 dark:text-gray-400 hover:underline">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/profiles"
          className="text-blue-600 dark:text-blue-400 hover:underline">
          &larr; Back to Profiles
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {profile.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {profile.phoneNumber}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Edit Profile
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50">
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Caller Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Caller Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.sourceLanguageFriendly}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Voice</p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.sourceVoice}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Transcription Provider
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.sourceTranscriptionProvider}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              TTS Provider
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.sourceTtsProvider}
            </p>
          </div>
        </div>
      </div>

      {/* Callee Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Callee Settings
        </h2>
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Custom Callee Details
          </p>
          <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
            {profile.calleeDetails ? "Enabled" : "Disabled"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Callee Phone Number
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.calleeNumber || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.calleeLanguageFriendly}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Voice</p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.calleeVoice}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Transcription Provider
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.calleeTranscriptionProvider}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              TTS Provider
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.calleeTtsProvider}
            </p>
          </div>
        </div>
      </div>

      {/* Flex Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Flex Settings
        </h2>
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Flex Enabled
          </p>
          <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
            {profile.useFlex ? "Enabled" : "Disabled"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Flex Number
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.flexNumber || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Flex Worker Handle
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {profile.flexWorkerHandle || "Not set"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
