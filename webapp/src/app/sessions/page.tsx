import { listSessions } from "@/lib/dynamodb";
import { getServerSession } from "next-auth/next";
import ClientSessionsPage from "../components/pages/sessions";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const session = await getServerSession();
  const owner =
    process.env.NEXT_PUBLIC_EMAIL || session?.user?.email || undefined;
  const sessions = await listSessions(owner);

  return <ClientSessionsPage serverSessions={sessions} />;
}
