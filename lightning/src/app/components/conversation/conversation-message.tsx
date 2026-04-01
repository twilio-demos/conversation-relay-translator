import { ConversationMessage } from "@/types/profile";
import { Message } from "@chatscope/chat-ui-kit-react";
import "./conversation-message.css";

export type ConversationMessageProps = {
  message: ConversationMessage;
  showTranslation?: boolean;
  streaming?: boolean;
  isPhone1?: boolean;
};

export default function ConversationMessageComponent({
  message,
  showTranslation = true,
  streaming = false,
  isPhone1 = true,
}: ConversationMessageProps) {
  const isCaller = message.whichParty === "caller";
  const isYou = isPhone1 ? isCaller : !isCaller;
  const label = isYou ? "You:" : "Caller:";
  const labelColor = isYou ? "#ffffff" : "#e53935";

  return (
    <Message
      model={{
        direction: isCaller ? "incoming" : "outgoing",
        position: "single",
      }}>
      <Message.CustomContent>
        <div
          style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <span
            style={{
              color: labelColor,
              fontWeight: 600,
              fontSize: "1.4rem",
              minWidth: "3rem",
              paddingTop: "1px",
              flexShrink: 0,
            }}>
            {label}
          </span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: streaming ? "#94a3b8" : "#e2e8f0",
                fontSize: "1.4rem",
                lineHeight: "1.6",
                fontStyle: streaming ? "italic" : "normal",
              }}>
              {message.original}
              {streaming && <span className="animate-pulse"> ...</span>}
            </div>
            {showTranslation && message.translated && (
              <div
                style={{
                  marginTop: "0.35rem",
                  paddingTop: "0.35rem",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                  fontSize: "1.25rem",
                  fontStyle: "italic",
                  lineHeight: "1.5",
                }}>
                {message.translated}
              </div>
            )}
          </div>
        </div>
      </Message.CustomContent>
    </Message>
  );
}
