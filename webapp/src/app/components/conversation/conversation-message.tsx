import { ConversationMessage } from "@/types/profile";

export type ConversationMessageProps = {
  message: ConversationMessage;
  showTranslation?: boolean;
};

export default function ConversationMessageComponent({
  message,
  showTranslation = true,
}: ConversationMessageProps) {
  const isCaller = message.whichParty === "caller";

  return (
    <div className={`flex ${isCaller ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 ${
          isCaller
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
            : "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100"
        }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase opacity-70">
            {message.whichParty}
          </span>
          <span className="text-xs opacity-50">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className="mb-2">
          <p className="text-sm font-medium mb-1">
            Original ({message.originalLanguageCode}):
          </p>
          <p className="text-base">{message.original}</p>
        </div>

        {showTranslation && (
          <div className="pt-2 border-t border-current opacity-80">
            <p className="text-sm font-medium mb-1">
              Translated ({message.translatedLanguageCode}):
            </p>
            <p className="text-base italic">{message.translated}</p>
          </div>
        )}
      </div>
    </div>
  );
}
