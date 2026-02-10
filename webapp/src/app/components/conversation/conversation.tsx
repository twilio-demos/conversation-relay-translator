"use client";

import { useConversation } from "@/hooks/use-conversation";
import { ConversationMessage } from "@/types/profile";
import Link from "next/link";
import ConversationMessageComponent from "../conversation/conversation-message";

export type ConversationProps = {
  serverConversation: ConversationMessage[];
};

export const Conversation = ({ serverConversation }: ConversationProps) => {
  console.log({ serverConversation });
  const {
    conversation,
    isPolling,
    setIsPolling,
    showTranslations,
    setShowTranslations,
    conversationId,
    calleeMessages,
    callerMessages,
    languages,
    session,
  } = useConversation(
    serverConversation || [],
    serverConversation?.[0]?.conversationId || ""
  );

  console.log(session);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link
              href="/sessions"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block">
              ← Back to Sessions
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Conversation
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPolling(!isPolling)}
              disabled={session?.callStatus != "connected"}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                isPolling
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-400 text-white hover:bg-gray-500"
              }`}>
              {isPolling ? "● Live" : "○ Paused"}
            </button>
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              {showTranslations ? "Hide" : "Show"} Translations
            </button>
          </div>
        </div>

        {/* Conversation Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
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
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Caller Messages
              </p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {callerMessages}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Callee Messages
              </p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {calleeMessages}
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
                  <span
                    key={lang}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {conversation.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            No messages in this conversation
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Messages
          </h2>
          <div className="space-y-2">
            {conversation.map((message, index) => (
              <ConversationMessageComponent
                key={`${message.timestamp}-${index}`}
                message={message}
                showTranslation={showTranslations}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
