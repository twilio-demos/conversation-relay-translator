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
  customSourceHash?: string;

  // Callee Settings
  calleeDetails: boolean;
  calleeNumber: string;
  calleeLanguage: string;
  calleeLanguageCode: string;
  calleeLanguageFriendly: string;
  calleeTranscriptionProvider: "Deepgram" | "Google";
  calleeTtsProvider: "Amazon" | "Google" | "ElevenLabs";
  calleeVoice: string;
  customCalleeHash?: string;

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
