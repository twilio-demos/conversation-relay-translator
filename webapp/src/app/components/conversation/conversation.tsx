"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConversation } from "@/hooks/use-conversation";
import { ConversationMessage } from "@/types/profile";
import { ChatContainer, MessageList } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ConversationMessageComponent from "../conversation/conversation-message";
import "./conversation.css";

export type ConversationProps = {
  serverConversation: ConversationMessage[];
};

export const Conversation = ({ serverConversation }: ConversationProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    conversation,
    isPolling,
    setIsPolling,
    showTranslations,
    setShowTranslations,
    conversationId,
    languages,
    session,
  } = useConversation(
    serverConversation || [],
    serverConversation?.[0]?.conversationId || ""
  );

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    if (messagesEndRef.current && isPolling) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link
              href="/sessions"
              className="text-sm hover:underline mb-2 inline-block">
              ← Back to Sessions
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Conversation
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPolling(!isPolling)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                isPolling
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-400 text-white hover:bg-gray-500"
              }`}>
              {isPolling ? "● Live" : "○ Paused"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTranslations(!showTranslations)}
              className="px-4 py-2 text-sm font-medium">
              {showTranslations ? "Hide" : "Show"} Translations
            </Button>
          </div>
        </div>

        {/* Conversation Stats */}
        <div className="bg-white dark:bg-gray-800  p-4 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Conversation ID
              </p>
              <p className="font-mono text-xs text-gray-900 dark:text-gray-100 truncate">
                {conversationId}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Total Messages</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {conversation.length}
              </p>
            </div>
          </div>

          {languages.size > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Languages:
              </p>
              <div className="flex gap-2">
                {Array.from(languages).map((lang) => (
                  <Badge key={lang}>{lang}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="border border-gray-200 dark:border-gray-700 border-t-0">
        <ChatContainer
          style={{
            height: "100%",
            width: "100%",
            border: "1px solid gray",
          }}>
          <MessageList style={{ height: "100%" }}>
            {conversation.map((m, idx) => (
              <ConversationMessageComponent
                key={`${m.timestamp}-${idx}`}
                message={m}
                showTranslation={showTranslations}
              />
            ))}
            <div ref={messagesEndRef} />
          </MessageList>
        </ChatContainer>
      </div>
    </div>
  );
};
