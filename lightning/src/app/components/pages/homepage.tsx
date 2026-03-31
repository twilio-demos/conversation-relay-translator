"use client";

import { AdminPanel } from "@/components/AdminPanel";
import { Config } from "@/components/Config";
import { useDemo } from "@/components/DemoProvider";
import { useSessions } from "@/hooks/use-sessions";
import { Session } from "@/types/profile";
import { useEffect } from "react";
import { Conversation } from "../conversation/conversation";

export type ClientHomepageProps = {
  serverSessions: Session[];
};

export const ClientHomepage = ({ serverSessions }: ClientHomepageProps) => {
  const { sessions } = useSessions(serverSessions);
  const { setCallActive, demoActive, pinnedConversationId, setPinnedConversationId, phone1, phone2 } = useDemo();

  const currentSession = sessions
    .filter(
      (s) =>
        s.phoneNumber === phone1 &&
        s.calleeNumber === phone2 &&
        s.callStatus === "connected"
    )
    .at(0);

  const liveId =
    currentSession?.parentConnectionId || currentSession?.connectionId || "";

  useEffect(() => {
    setCallActive(!!currentSession);
    if (liveId && demoActive && !pinnedConversationId) {
      setPinnedConversationId(liveId);
    }
  }, [liveId, demoActive]);

  const conversationId = demoActive ? (pinnedConversationId || liveId) : liveId;

  return (
    <div className="h-full">
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_640px] gap-6 items-stretch h-full">
        {/* Left: Conversation */}
        <div className="flex flex-col">
          {conversationId ? (
            <Conversation serverConversation={[]} id={conversationId} />
          ) : (
            <div className="flex-1 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-center text-muted-foreground text-lg h-full p-8" style={{ boxShadow: "inset 0 0 30px rgba(99,179,237,0.15)" }}>
              No active sessions. Start a call to see the conversation here.
            </div>
          )}
        </div>

        {/* Right: Config */}
        <div className="flex flex-col">
          <Config />
        </div>
      </div>
      <AdminPanel />
    </div>
  );
};
