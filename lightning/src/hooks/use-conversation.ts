"use client";

import { ConversationMessage } from "@/types/profile";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "./use-session";

export type ConversationProps = {
  serverConversation: ConversationMessage[];
};

export const useConversation = (
  initialConversation: ConversationMessage[],
  conversationId: string
) => {
  const { session } = useSession(conversationId);
  const [conversation, setConversation] =
    useState<ConversationMessage[]>(initialConversation);

  const [showTranslations, setShowTranslations] = useState(true);
  const [isPolling, setIsPolling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const callerMessages = useMemo(
    () => conversation.filter((m) => m.whichParty === "caller").length,
    [conversation]
  );

  const calleeMessages = useMemo(
    () => conversation.filter((m) => m.whichParty === "callee").length,
    [conversation]
  );

  const languages = useMemo(
    () =>
      conversation.reduce((acc, msg) => {
        acc.add(msg.originalLanguageCode);
        acc.add(msg.translatedLanguageCode);
        return acc;
      }, new Set<string>()),
    [conversation]
  );

  useEffect(() => {
    if (!isPolling) {
      return;
    }

    const pollMessages = async () => {
      try {
        const response = await fetch(
          `/api/conversations/${encodeURIComponent(conversationId)}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setConversation(data);
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    };

    pollMessages();

    intervalRef.current = setInterval(pollMessages, 2000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [conversationId, isPolling]);

  return {
    conversation,
    showTranslations,
    isPolling,
    setIsPolling,
    setShowTranslations,
    conversationId,
    calleeMessages,
    callerMessages,
    languages,
    session,
  };
};
