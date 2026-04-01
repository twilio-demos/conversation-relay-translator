"use client";

import { Button } from "@/components/ui/button";
import { useConversation } from "@/hooks/use-conversation";
import { ConversationMessage } from "@/types/profile";
import { ChatContainer, MessageList } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useEffect, useRef } from "react";
import ConversationMessageComponent from "../conversation/conversation-message";
import "./conversation.css";

export type ConversationProps = {
  serverConversation: ConversationMessage[];
  id: string;
};

export const Conversation = ({ serverConversation, id }: ConversationProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { conversation, isPolling, setIsPolling, showTranslations, session } =
    useConversation(serverConversation || [], id);

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    if (scrollContainerRef.current && isPolling) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div
      className="rounded-lg border border-dashed border-gray-700 flex flex-col h-full overflow-hidden"
      style={{ boxShadow: "inset 0 0 30px rgba(99,179,237,0.15)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
        <h2 className="text-3xl font-semibold text-white">Active Call</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPolling(!isPolling)}
          className={`text-sm font-medium ${
            isPolling
              ? "text-green-400 hover:text-green-300"
              : "text-gray-400 hover:text-gray-300"
          }`}>
          {isPolling ? "● Live" : "○ Paused"}
        </Button>
      </div>

      {/* Stats strip */}
      {(conversation.length > 0 || session) && (
        <div className="flex items-center gap-6 px-6 py-2 border-b border-white/10 text-sm text-gray-400">
          <span>{conversation.length} messages</span>
          {session?.sourceLanguageFriendly && session?.calleeLanguageFriendly && (
            <span className="font-medium text-white/80">
              {session.sourceLanguageFriendly} ⇄ {session.calleeLanguageFriendly}
            </span>
          )}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollContainerRef} style={{ maxHeight: "calc(100vh - 12rem)", overflowY: "auto" }}>
        <ChatContainer
          style={{ height: "auto", width: "100%", border: "none" }}>
          <MessageList style={{ height: "auto" }}>
            {conversation.map((m, idx) => (
              <ConversationMessageComponent
                key={`${m.timestamp}-${idx}`}
                message={m}
                showTranslation={showTranslations}
              />
            ))}
          </MessageList>
        </ChatContainer>
      </div>
    </div>
  );
};
