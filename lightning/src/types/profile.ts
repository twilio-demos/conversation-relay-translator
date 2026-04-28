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

export interface ConversationParticipantAddress {
  address: string;
  channel: string;
  channelId: string;
}

export interface ConversationParticipant {
  accountId: string;
  addresses: ConversationParticipantAddress[];
  conversationId: string;
  createdAt: string;
  id: string;
  name: string | null;
  profileId: string | null;
  type: "AI_AGENT" | "CUSTOMER" | string;
  updatedAt: string;
}

export interface ConversationStatusCallback {
  method: string;
  url: string;
}

export interface ConversationChannelSettings {
  captureRules: unknown[];
  statusTimeouts: unknown | null;
}

export interface ConversationConfiguration {
  channelSettings: Record<string, ConversationChannelSettings>;
  conversationGroupingType: string;
  conversationsV1Bridge: unknown | null;
  description: string | null;
  displayName: string | null;
  intelligenceConfigurationIds: string[];
  memoryExtractionEnabled: boolean;
  memoryStoreId: string | null;
  statusCallbacks: ConversationStatusCallback[];
}

export interface CintelConversation {
  accountId: string;
  configuration: ConversationConfiguration;
  configurationId: string;
  createdAt: string;
  id: string;
  name: string | null;
  participants: ConversationParticipant[];
  status: "ACTIVE" | "CLOSED" | string;
  updatedAt: string;
}

export interface CintelConversationsResponse {
  conversations: CintelConversation[];
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
