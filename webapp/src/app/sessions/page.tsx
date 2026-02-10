import { listSessions } from "@/lib/dynamodb";
import ClientSessionsPage from "../components/pages/sessions";

export default async function SessionsPage() {
  const sessions = await listSessions();

  return <ClientSessionsPage serverSessions={sessions} />;
}
