export interface UserProfile {
  phoneNumber: string;
  name: string;

  // Source (Caller) Settings
  sourceLanguage: string;
  sourceLanguageCode: string;
  sourceLanguageFriendly: string;
  sourceTranscriptionProvider: "Deepgram" | "Google";
  sourceTtsProvider: "Amazon" | "Google";
  sourceVoice: string;

  // Callee Settings
  calleeDetails: boolean;
  calleeNumber: string;
  calleeLanguage: string;
  calleeLanguageCode: string;
  calleeLanguageFriendly: string;
  calleeTranscriptionProvider: "Deepgram" | "Google";
  calleeTtsProvider: "Amazon" | "Google";
  calleeVoice: string;

  // Flex Settings
  useFlex: boolean;
  flexNumber: string;
  flexWorkerHandle: string;
}

export interface DynamoDBProfile {
  pk: { S: string };
  sk: { S: string };
  calleeDetails: { BOOL: boolean };
  calleeLanguage: { S: string };
  calleeLanguageCode: { S: string };
  calleeLanguageFriendly: { S: string };
  calleeNumber: { S: string };
  calleeTranscriptionProvider: { S: string };
  calleeTtsProvider: { S: string };
  calleeVoice: { S: string };
  name: { S: string };
  pk1: { S: string };
  sk1: { S: string };
  sourceLanguage: { S: string };
  sourceLanguageCode: { S: string };
  sourceLanguageFriendly: { S: string };
  sourceTranscriptionProvider: { S: string };
  sourceTtsProvider: { S: string };
  sourceVoice: { S: string };
}

export const LANGUAGES = [
  { code: "en-US", friendly: "English - United States", translateCode: "en" },
  { code: "es-MX", friendly: "Spanish - Mexico", translateCode: "es" },
  { code: "es-ES", friendly: "Spanish - Spain", translateCode: "es" },
  { code: "fr-FR", friendly: "French - France", translateCode: "fr" },
  { code: "de-DE", friendly: "German - Germany", translateCode: "de" },
  { code: "it-IT", friendly: "Italian - Italy", translateCode: "it" },
  { code: "pt-BR", friendly: "Portuguese - Brazil", translateCode: "pt" },
  { code: "ja-JP", friendly: "Japanese - Japan", translateCode: "ja" },
  { code: "zh-CN", friendly: "Chinese - Mandarin", translateCode: "zh" },
];

export const VOICES = {
  en: [
    "Matthew-Generative",
    "Joanna-Generative",
    "Kevin-Generative",
    "Salli-Generative",
  ],
  es: ["Lupe-Generative", "Pedro-Generative", "Mia-Generative"],
  fr: ["Lea-Generative", "Remi-Generative"],
  de: ["Vicki-Generative", "Daniel-Generative"],
};

export interface Session {
  connectionId: string;
  callSid?: string;
  name?: string;
  phoneNumber: string;
  calleeNumber?: string;

  // Source (Caller) Settings
  sourceLanguage?: string;
  sourceLanguageCode?: string;
  sourceLanguageFriendly?: string;
  sourceTranscriptionProvider?: "Deepgram" | "Google";
  sourceTtsProvider?: "Amazon" | "Google";
  sourceVoice?: string;

  // Callee Settings
  calleeDetails?: boolean | string;
  calleeLanguage?: string;
  calleeLanguageCode?: string;
  calleeLanguageFriendly?: string;
  calleeTranscriptionProvider?: "Deepgram" | "Google";
  calleeTtsProvider?: "Amazon" | "Google";
  calleeVoice?: string;

  // Session metadata
  callStatus?: string;
  direction?: string;
  whichParty?: "caller" | "callee";
  parentConnectionId?: string;
  translationActive?: boolean;
  targetConnectionId?: string;
  createdAt?: number;
  expireAt?: number;
}

export interface ConversationMessage {
  conversationId: string;
  timestamp: number;
  whichParty: "caller" | "callee";
  partyConnectionId: string;
  original: string;
  originalLanguageCode: string;
  translated: string;
  translatedLanguageCode: string;
}
