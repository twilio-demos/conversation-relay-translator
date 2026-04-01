export interface CintelResult {
  accountId: string;
  conversationId: string;
  intelligenceConfiguration: IntelligenceConfiguration;
  operatorResults: OperatorResult[];
}

export interface IntelligenceConfiguration {
  id: string;
  displayName: string;
  version: number;
  ruleId: string;
}

export interface OperatorResult {
  id: string;
  operator: Operator;
  outputFormat: string;
  result: Result;
  dateCreated: string;
  referenceIds: string[];
  executionDetails: ExecutionDetails;
}

export type StoredOperatorResult = OperatorResult & {
  operatorFor: string;
  cintelConversationId: string;
  phoneNumber?: string;
};

export interface Operator {
  id: string;
  displayName: string;
  version: number;
  parameters: Parameters;
}

export interface Parameters {}

export interface Result {
  mood: string;
  summary: string;
  justification: string;
}

export interface ExecutionDetails {
  trigger: Trigger;
  communications: Communications;
  channels: string[];
  participants: Participant[];
  context: any;
}

export interface Trigger {
  on: string;
  timestamp: string;
}

export interface Communications {
  first: string;
  last: string;
}

export interface Participant {
  id: string;
  profileId?: string;
  type: string;
}
