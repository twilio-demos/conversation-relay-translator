import { ConversationMessage, Session, UserProfile } from "@/types/profile";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  ...(process.env.AWS_ROLE_ARN
    ? {
        credentials: awsCredentialsProvider({
          roleArn: process.env.AWS_ROLE_ARN,
        }),
      }
    : {}),
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "";

// Convert UserProfile to DynamoDB format
export function profileToDynamoDB(profile: UserProfile): any {
  return {
    pk: profile.phoneNumber,
    sk: "profile",
    pk1: "profile",
    sk1: profile.phoneNumber,
    name: profile.name,
    calleeDetails: profile.calleeDetails,
    calleeLanguage: profile.calleeLanguage,
    calleeLanguageCode: profile.calleeLanguageCode,
    calleeLanguageFriendly: profile.calleeLanguageFriendly,
    calleeNumber: profile.calleeNumber,
    calleeTranscriptionProvider: profile.calleeTranscriptionProvider,
    calleeTtsProvider: profile.calleeTtsProvider,
    calleeVoice: profile.calleeVoice,
    sourceLanguage: profile.sourceLanguage,
    sourceLanguageCode: profile.sourceLanguageCode,
    sourceLanguageFriendly: profile.sourceLanguageFriendly,
    sourceTranscriptionProvider: profile.sourceTranscriptionProvider,
    sourceTtsProvider: profile.sourceTtsProvider,
    sourceVoice: profile.sourceVoice,
    useFlex: profile.useFlex,
    flexNumber: profile.flexNumber,
    flexWorkerHandle: profile.flexWorkerHandle,
  };
}

// Convert DynamoDB format to UserProfile
export function dynamoDBToProfile(item: any): UserProfile {
  return {
    phoneNumber: item.pk,
    name: item.name,
    calleeDetails: item.calleeDetails,
    calleeLanguage: item.calleeLanguage,
    calleeLanguageCode: item.calleeLanguageCode,
    calleeLanguageFriendly: item.calleeLanguageFriendly,
    calleeNumber: item.calleeNumber,
    calleeTranscriptionProvider: item.calleeTranscriptionProvider,
    calleeTtsProvider: item.calleeTtsProvider,
    calleeVoice: item.calleeVoice,
    sourceLanguage: item.sourceLanguage,
    sourceLanguageCode: item.sourceLanguageCode,
    sourceLanguageFriendly: item.sourceLanguageFriendly,
    sourceTranscriptionProvider: item.sourceTranscriptionProvider,
    sourceTtsProvider: item.sourceTtsProvider,
    sourceVoice: item.sourceVoice,
    flexNumber: item.flexNumber,
    useFlex: item.useFlex,
    flexWorkerHandle: item.flexWorkerHandle,
  };
}

// Convert DynamoDB format to Session
export function dynamoDBToSession(item: any): Session {
  return {
    connectionId: item.pk,
    callSid: item.callSid,
    name: item.name,
    phoneNumber: item.pk,
    calleeNumber: item.calleeNumber,
    sourceLanguage: item.sourceLanguage,
    sourceLanguageCode: item.sourceLanguageCode,
    sourceLanguageFriendly: item.sourceLanguageFriendly,
    sourceTranscriptionProvider: item.sourceTranscriptionProvider,
    sourceTtsProvider: item.sourceTtsProvider,
    sourceVoice: item.sourceVoice,
    calleeDetails: item.calleeDetails,
    calleeLanguage: item.calleeLanguage,
    calleeLanguageCode: item.calleeLanguageCode,
    calleeLanguageFriendly: item.calleeLanguageFriendly,
    calleeTranscriptionProvider: item.calleeTranscriptionProvider,
    calleeTtsProvider: item.calleeTtsProvider,
    calleeVoice: item.calleeVoice,
    callStatus: item.callStatus,
    direction: item.direction,
    whichParty: item.whichParty,
    parentConnectionId: item.parentConnectionId,
    translationActive: item.translationActive,
    targetConnectionId: item.targetConnectionId,
    expireAt: item.expireAt,
  };
}

// Convert DynamoDB format to ConversationMessage
export function dynamoDBToConversationMessage(item: any): ConversationMessage {
  return {
    conversationId: item.pk,
    timestamp: item.chat.ts,
    whichParty: item.chat.whichParty,
    partyConnectionId: item.chat.partyConnectionId,
    original: item.chat.original,
    originalLanguageCode: item.chat.originalLanguageCode,
    translated: item.chat.translated,
    translatedLanguageCode: item.chat.translatedLanguageCode,
  };
}

// Create or update a profile
export async function putProfile(profile: UserProfile): Promise<void> {
  const item = profileToDynamoDB(profile);

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });

  await docClient.send(command);
}

// Get a profile by phone number
export async function getProfile(
  phoneNumber: string
): Promise<UserProfile | null> {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: phoneNumber,
      sk: "profile",
    },
  });

  const response = await docClient.send(command);
  return response.Item ? dynamoDBToProfile(response.Item) : null;
}

// List all profiles
export async function listProfiles(): Promise<UserProfile[]> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "index-1-full",
    KeyConditionExpression: "pk1 = :pk1",
    ExpressionAttributeValues: {
      ":pk1": "profile",
    },
  });

  const response = await docClient.send(command);
  return response.Items ? response.Items.map(dynamoDBToProfile) : [];
}

// List all sessions
export async function listSessions(): Promise<Session[]> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "index-1-full",
    KeyConditionExpression: "pk1 = :pk1",
    ExpressionAttributeValues: {
      ":pk1": "connection",
    },
  });

  const response = await docClient.send(command);
  return response.Items
    ? response.Items.filter((s) => s.calleeLanguageFriendly).map(
        dynamoDBToSession
      )
    : [];
}

// Get session by ID
export async function getSession(sessionId: string): Promise<Session | null> {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: sessionId,
      sk: "connection",
    },
  });

  const response = await docClient.send(command);
  return response.Item ? dynamoDBToSession(response.Item) : null;
}

// Get conversation messages by conversation ID
export async function getConversation(
  conversationId: string
): Promise<ConversationMessage[]> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "index-1-full",
    KeyConditionExpression: "pk1 = :pk1 AND begins_with(sk1, :conversationId)",
    ExpressionAttributeValues: {
      ":pk1": "spokenText",
      ":conversationId": conversationId,
    },
    ScanIndexForward: true,
  });

  const response = await docClient.send(command);
  return response.Items
    ? response.Items.map(dynamoDBToConversationMessage)
    : [];
}

// Delete a profile
export async function deleteProfile(phoneNumber: string): Promise<void> {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: phoneNumber,
      sk: "profile",
    },
  });

  await docClient.send(command);
}
