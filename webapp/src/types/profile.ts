export interface UserProfile {
  phoneNumber: string;
  name: string;
  creator?: string;

  // Source (Caller) Settings
  sourceLanguage: string;
  sourceLanguageCode: string;
  sourceLanguageFriendly: string;
  sourceTranscriptionProvider: "Deepgram" | "Google";
  sourceTtsProvider: "Amazon" | "Google" | "ElevenLabs";
  sourceVoice: string;

  // Callee Settings
  calleeDetails: boolean;
  calleeNumber: string;
  calleeLanguage: string;
  calleeLanguageCode: string;
  calleeLanguageFriendly: string;
  calleeTranscriptionProvider: "Deepgram" | "Google";
  calleeTtsProvider: "Amazon" | "Google" | "ElevenLabs";
  calleeVoice: string;

  // Flex Settings
  useFlex: boolean;
  flexNumber: string;
  flexWorkerHandle: string;
  useExternalFlex: boolean;
  externalFlexNumber: string;
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
  { code: "en-US", friendly: "English (United States)", translateCode: "en" },
  { code: "es-MX", friendly: "Spanish (Mexico)", translateCode: "es" },
  { code: "es-ES", friendly: "Spanish (Spain)", translateCode: "es" },
  { code: "fr-FR", friendly: "French", translateCode: "fr" },
  { code: "de-DE", friendly: "German", translateCode: "de" },
  { code: "it-IT", friendly: "Italian", translateCode: "it" },
  { code: "pt-BR", friendly: "Portuguese", translateCode: "pt" },
  { code: "ja-JP", friendly: "Japanese", translateCode: "ja" },
  { code: "zh-CN", friendly: "Chinese (Mandarin)", translateCode: "zh" },
  { code: "zh-HK", friendly: "Chinese (Cantonese)", translateCode: "zh-TW" },
  { code: "nl-NL", friendly: "Dutch", translateCode: "nl" },
  { code: "ko-KR", friendly: "Korean", translateCode: "ko" },
];

export const AMAZON_VOICES = {
  en: ["Matthew-Generative", "Joanna-Generative"], // English
  es: ["Lupe-Generative", "Pedro-Generative"], // Spanish
  de: ["Vicki-Generative", "Daniel-Generative"], // German
  fr: ["Lea-Generative", "Remi-Generative"], // French
  it: ["Bianca-Generative", "Adriano-Neural"], // Italian
  pt: ["Camila-Neural", "Thiago-Neural"], // Portuguese
  ja: ["Takumi-Neural", "Kazuha-Neural"], // Japanese
  zh: ["Zhiyu-Neural"], // Chinese (Mandarin)
  "zh-TW": ["Hiujin-Neural"], // Chinese (Cantonese)
  nl: ["Laura-Neural", "Ruben"], // Dutch
  ko: ["Seoyeon-Neural"], // Korean
};

export const GOOGLE_VOICES = {
  en: ["en-US-Chirp3-HD-Aoede", "en-US-Chirp3-HD-Charon"], // English
  es: ["es-ES-Chirp3-HD-Aoede", "es-ES-Chirp3-HD-Charon"], // Spanish
  de: ["de-DE-Chirp3-HD-Aoede", "de-DE-Chirp3-HD-Charon"], // German
  fr: ["fr-FR-Chirp3-HD-Aoede", "fr-FR-Chirp3-HD-Charon"], // French
  it: ["it-IT-Chirp3-HD-Aoede", "it-IT-Chirp3-HD-Charon"], // Italian
  pt: ["pt-BR-Chirp3-HD-Aoede", "pt-BR-Chirp3-HD-Charon"], // Portuguese
  ja: ["ja-JP-Chirp3-HD-Aoede", "ja-JP-Chirp3-HD-Charon"], // Japanese
  zh: ["cmn-CN-Chirp3-HD-Aoede", "cmn-CN-Chirp3-HD-Charon"], // Chinese (Mandarin)
  "zh-TW": ["yue-HK-Standard-A", "yue-HK-Standard-B"], // Chinese (Cantonese)
  nl: ["nl-NL-Chirp3-HD-Aoede", "nl-NL-Chirp3-HD-Charon"], // Dutch
  ko: ["ko-KR-Chirp3-HD-Aoede", "ko-KR-Chirp3-HD-Charon"], // Korean
};

// Helper function to get friendly name for Google voices
// First voice is always Female, second is always Male
export function getGoogleVoiceFriendlyName(voice: string): string {
  const voiceIndex = Object.values(GOOGLE_VOICES).flat().indexOf(voice);

  if (voiceIndex === -1) return voice;

  // Check if it's at an even index (0, 2, 4...) = Female
  // Or odd index (1, 3, 5...) = Male
  for (const voices of Object.values(GOOGLE_VOICES)) {
    const index = voices.indexOf(voice);
    if (index !== -1) {
      return index === 0 ? "Female" : "Male";
    }
  }

  return voice;
}

export const ELEVEN_LABS_VOICES = {
  en: ["UgBBYS2sOqTuMpoF3BR0", "xctasy8XvGp2cVO9HL9k"], // English
  es: ["JYyJjNPfmNJdaby8LdZs", "sDh3eviBhiuHKi0MjTNq"], // Spanish
  de: ["IWm8DnJ4NGjFI7QAM5lM", "yVKATr0ZJETwd3tQtpNG"], // German
  fr: ["hFgOzpmS0CMtL2to8sAl", "EIe4oLyymVX7lKVYli9m"], // French
  it: ["13Cuh3NuYvWOVQtLbRN8", "kAzI34nYjizE0zON6rXv"], // Italian
  pt: ["WsQeRzWJvoDvhPPJj5r7", "NkpT2jezTenCDRKHkWiX"], // Portuguese
  ja: ["8EkOjt4xTPGMclNlh1pk", "Bj4Malc5SZLoXfPtxRxH"], // Japanese
  zh: ["4VZIsMPtgggwNg7OXbPY", "tOuLUAIdXShmWH7PEUrU"], // Chinese (Mandarin)
  "zh-TW": ["OjkyUe8dIihIFvOisuvM", "n4xdXKggn5lFcXFYE4TA"], // Chinese (Cantonese)
  nl: ["fzC7H9Y1bPn3gzVLtghe", "XJa38TJgDqYhj5mYbSJA"], // Dutch
  ko: ["bciERhbhQhAIWwvnQA7H", "uyVNoMrnUku1dZyVEXwD"], // Korean
};

export const ELEVEN_LABS_VOICES_TO_FRIENDLY: Record<string, string> = {
  "4VZIsMPtgggwNg7OXbPY": "James",
  tOuLUAIdXShmWH7PEUrU: "Julia",
  OjkyUe8dIihIFvOisuvM: "Tung",
  n4xdXKggn5lFcXFYE4TA: "Chloe",
  fzC7H9Y1bPn3gzVLtghe: "Marcèles",
  XJa38TJgDqYhj5mYbSJA: "Bella",
  IWm8DnJ4NGjFI7QAM5lM: "Stephan",
  yVKATr0ZJETwd3tQtpNG: "Julia",
  hFgOzpmS0CMtL2to8sAl: "Camille",
  EIe4oLyymVX7lKVYli9m: "Nicolas",
  bciERhbhQhAIWwvnQA7H: "Seongmin",
  uyVNoMrnUku1dZyVEXwD: "Anna",
  UgBBYS2sOqTuMpoF3BR0: "Mark",
  xctasy8XvGp2cVO9HL9k: "Allison",
  JYyJjNPfmNJdaby8LdZs: "Marlene",
  sDh3eviBhiuHKi0MjTNq: "Francis",
  "13Cuh3NuYvWOVQtLbRN8": "Marco",
  kAzI34nYjizE0zON6rXv: "Sami",
  WsQeRzWJvoDvhPPJj5r7: "Francisco",
  NkpT2jezTenCDRKHkWiX: "Benedita",
  "8EkOjt4xTPGMclNlh1pk": "Mori",
  Bj4Malc5SZLoXfPtxRxH: "Hiro",
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
