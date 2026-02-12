"use client";

import { ProfileForm } from "@/components/ProfileForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <Button variant="link" asChild className="pl-0">
            <Link href="/profiles">&larr; Back to Profiles</Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        <ProfileForm profile={profile} onSubmit={handleUpdate} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="link" asChild className="pl-0">
          <Link href="/profiles">&larr; Back to Profiles</Link>
        </Button>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground mt-1">{profile.phoneNumber}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="default" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive">
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Caller Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col gap-2">
              <span>Caller Settings</span>
              <span className="text-sm font-normal text-muted-foreground">
                Your caller settings
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Language</p>
              <p className="text-base font-medium mt-1">
                {profile.sourceLanguageFriendly}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Voice</p>
              <p className="text-base font-medium mt-1">
                {profile.sourceVoice}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Transcription Provider
              </p>
              <p className="text-base font-medium mt-1">
                {profile.sourceTranscriptionProvider}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">TTS Provider</p>
              <p className="text-base font-medium mt-1">
                {profile.sourceTtsProvider}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Callee Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col gap-2">
              <span>Callee Settings</span>
              <span className="text-sm font-normal text-muted-foreground">
                Settings for who you are calling
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Custom Callee Details
            </p>
            <Badge
              variant={profile.calleeDetails ? "default" : "secondary"}
              className="mt-1">
              {profile.calleeDetails ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">
                Callee Phone Number
              </p>
              <p className="text-base font-medium mt-1">
                {profile.calleeNumber || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Language</p>
              <p className="text-base font-medium mt-1">
                {profile.calleeLanguageFriendly}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Voice</p>
              <p className="text-base font-medium mt-1">
                {profile.calleeVoice}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Transcription Provider
              </p>
              <p className="text-base font-medium mt-1">
                {profile.calleeTranscriptionProvider}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">TTS Provider</p>
              <p className="text-base font-medium mt-1">
                {profile.calleeTtsProvider}
              </p>
            </div>
          </div>
        </CardContent>

        <div className="px-6 pb-6">
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Flex Settings</h3>
            <div className="rounded-lg space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Flex Enabled</p>
                <Badge
                  variant={profile.useFlex ? "default" : "secondary"}
                  className="mt-1">
                  {profile.useFlex ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Flex Number</p>
                  <p className="text-base font-medium mt-1">
                    {profile.flexNumber || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Flex Worker Handle
                  </p>
                  <p className="text-base font-medium mt-1">
                    {profile.flexWorkerHandle || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
