import { listProfiles } from "@/lib/dynamodb";
import ClientProfilesPage from "../components/pages/profiles";

export const dynamic = 'force-dynamic';

export default async function ProfilesPage() {
  const profiles = await listProfiles();

  return <ClientProfilesPage profiles={profiles} />;
}
