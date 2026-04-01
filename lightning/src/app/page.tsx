import { listAllSessions } from "@/lib/dynamodb";
import { ClientHomepage } from "./components/pages/homepage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sessions = await listAllSessions();

  return <ClientHomepage serverSessions={sessions} />;
}
