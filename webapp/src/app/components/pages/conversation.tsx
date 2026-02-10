"use client";

import { ConversationMessage } from "@/types/profile";
import { Conversation } from "../conversation/conversation";

export type ClientConversationProps = {
  conversation: ConversationMessage[];
};

export const ClientConversation = ({
  conversation,
}: ClientConversationProps) => {
  return <Conversation serverConversation={conversation} />;
};
