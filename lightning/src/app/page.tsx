import { listSessions } from "@/lib/dynamodb";
import { getServerSession } from "next-auth/next";
import { ClientHomepage } from "./components/pages/homepage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession();
  const owner =
    process.env.NEXT_PUBLIC_EMAIL || session?.user?.email || undefined;
  const sessions = await listSessions(owner);

  return <ClientHomepage serverSessions={sessions} />;
}
