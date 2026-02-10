import { ClientConversation } from "@/app/components/pages/conversation";
import { getConversation } from "@/lib/dynamodb";

export type ConversationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const urlParams = await params;
  const conversation = await getConversation(decodeURIComponent(urlParams.id));

  console.log({ conversation });
  return <ClientConversation conversation={conversation} />;
}
