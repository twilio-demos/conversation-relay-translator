"use client";

import { AdminPanel } from "@/components/AdminPanel";
import { Config } from "@/components/Config";
import { useDemo } from "@/components/DemoProvider";
import { useReadyState } from "@/hooks/use-ready-state";
import { useSessions } from "@/hooks/use-sessions";
import { Session } from "@/types/profile";
import { useEffect } from "react";
import { Conversation } from "../conversation/conversation";

export type ClientHomepageProps = {
  serverSessions: Session[];
};

export const ClientHomepage = ({ serverSessions }: ClientHomepageProps) => {
  const { sessions } = useSessions(serverSessions);
  const {
    setCallActive,
    demoActive,
    pinnedConversationId,
    setPinnedConversationId,
    phone1,
    phone2,
    isPhone1,
  } = useDemo();
  const publicPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const { readyState } = useReadyState();
  const myReady = isPhone1 ? readyState.p1Ready : readyState.p2Ready;
  const otherReady = isPhone1 ? readyState.p2Ready : readyState.p1Ready;

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

  const conversationId = demoActive ? pinnedConversationId || liveId : liveId;

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_640px] gap-6 items-stretch h-full">
        {/* Left: Conversation */}
        <div className="flex flex-col">
          {conversationId ? (
            <Conversation serverConversation={[]} id={conversationId} />
          ) : (
            <div
              className="flex-1 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-center text-muted-foreground text-2xl h-full p-8"
              style={{ boxShadow: "inset 0 0 30px rgba(99,179,237,0.15)" }}>
              {isPhone1 ? (
                <>
                  {myReady && otherReady ? (
                    <>
                      Call&nbsp;
                      <span className="text-foreground font-medium">{publicPhone}</span>
                      &nbsp;to start
                    </>
                  ) : myReady ? (
                    <>Waiting on the other person to confirm</>
                  ) : (
                    <>Pick your language and confirm</>
                  )}
                </>
              ) : (
                <>
                  {myReady ? (
                    <>
                      Wait on a call from&nbsp;
                      <span className="text-foreground font-medium">{publicPhone}</span>
                    </>
                  ) : (
                    <>Pick a language and confirm</>
                  )}
                </>
              )}
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
