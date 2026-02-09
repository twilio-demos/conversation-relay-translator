import ClientProfilePage from "@/app/components/pages/profile";
import { getProfile } from "@/lib/dynamodb";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export type ProfilePageParams = {
  params: { number: string };
};

export default async function ProfilePage({ params }: ProfilePageParams) {
  const urlParams = await params;
  const phoneNumber = decodeURIComponent(urlParams.number);
  const profile = await getProfile(phoneNumber);

  if (!profile) {
    notFound();
  }

  return <ClientProfilePage profile={profile} />;
}
