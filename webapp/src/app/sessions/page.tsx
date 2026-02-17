import { listSessions } from "@/lib/dynamodb";
import ClientSessionsPage from "../components/pages/sessions";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const sessions = await listSessions();

  return <ClientSessionsPage serverSessions={sessions} />;
}
