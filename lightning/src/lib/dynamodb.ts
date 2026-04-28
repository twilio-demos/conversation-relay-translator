import { OperatorResult, StoredOperatorResult } from "@/types/cintel";
import { ConversationMessage, Session, UserProfile } from "@/types/profile";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
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

export function profileToDynamoDB(profile: UserProfile): any {
  return {
    pk: profile.phoneNumber,
    sk: "profile",
    pk1: "profile",
    sk1: profile.phoneNumber,
    name: profile.name,
    creator: profile.creator,
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
    useExternalFlex: profile.useExternalFlex,
    externalFlexNumber: profile.externalFlexNumber,
    customSourceHash: profile.customSourceHash,
    customCalleeHash: profile.customCalleeHash,
  };
}

export function dynamoDBToProfile(item: any): UserProfile {
  return {
    phoneNumber: item.pk,
    name: item.name,
    creator: item.creator,
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
    useExternalFlex: item.useExternalFlex,
    externalFlexNumber: item.externalFlexNumber,
    customSourceHash: item.customSourceHash,
    customCalleeHash: item.customCalleeHash,
  };
}

// Convert DynamoDB format to Session
export function dynamoDBToSession(item: any): Session {
  return {
    connectionId: item.pk,
    callSid: item.callSid,
    name: item.name,
    phoneNumber: item.From,
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

export async function listProfiles(creator?: string): Promise<UserProfile[]> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "index-1-full",
    KeyConditionExpression: "pk1 = :pk1",
    ExpressionAttributeValues: {
      ":pk1": "profile",
      ...(creator ? { ":creator": creator } : {}),
    },
    ...(creator ? { FilterExpression: "creator = :creator" } : {}),
  });

  const response = await docClient.send(command);
  return response.Items ? response.Items.map(dynamoDBToProfile) : [];
}

export async function listAllSessions(): Promise<Session[]> {
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

// Store an operator result keyed by its unique id
export async function putCintelOperatorResult(
  operatorResult: OperatorResult,
  operatorFor: string,
  cintelConversationId: string,
  phoneNumber?: string
): Promise<void> {
  const stored: StoredOperatorResult = {
    ...operatorResult,
    operatorFor,
    cintelConversationId,
    phoneNumber,
  };
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      pk: operatorResult.id,
      sk: "cintel",
      pk1: "cintel",
      sk1: operatorResult.dateCreated,
      phoneNumber,
      data: stored,
    },
  });
  await docClient.send(command);
}

// Delete cintel operator results by phone number
export async function deleteCintelResultsByPhone(
  phoneNumber: string
): Promise<void> {
  const matching: { pk: string; sk: string }[] = [];
  let lastKey: Record<string, any> | undefined;

  do {
    const response = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "index-1-full",
        KeyConditionExpression: "pk1 = :pk1",
        ExpressionAttributeValues: { ":pk1": "cintel" },
        ...(lastKey ? { ExclusiveStartKey: lastKey } : {}),
      })
    );
    for (const item of response.Items ?? []) {
      if (
        item.phoneNumber === phoneNumber ||
        item.data?.phoneNumber === phoneNumber
      ) {
        matching.push({ pk: item.pk, sk: item.sk });
      }
    }
    lastKey = response.LastEvaluatedKey;
  } while (lastKey);

  if (matching.length === 0) return;

  for (let i = 0; i < matching.length; i += 25) {
    const batch = matching.slice(i, i + 25).map((item) => ({
      DeleteRequest: { Key: { pk: item.pk, sk: item.sk } },
    }));
    await docClient.send(
      new BatchWriteCommand({ RequestItems: { [TABLE_NAME]: batch } })
    );
  }
}

// Delete all cintel operator results
export async function deleteCintelResults(): Promise<void> {
  const queryCommand = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "index-1-full",
    KeyConditionExpression: "pk1 = :pk1",
    ExpressionAttributeValues: { ":pk1": "cintel" },
    ProjectionExpression: "pk, sk",
  });
  const { Items = [] } = await docClient.send(queryCommand);
  if (Items.length === 0) return;

  // BatchWrite supports up to 25 items per request
  for (let i = 0; i < Items.length; i += 25) {
    const batch = Items.slice(i, i + 25).map((item) => ({
      DeleteRequest: { Key: { pk: item.pk, sk: item.sk } },
    }));
    await docClient.send(
      new BatchWriteCommand({ RequestItems: { [TABLE_NAME]: batch } })
    );
  }
}

// Get all operator results ordered by dateCreated descending
export async function getCintelResults(): Promise<StoredOperatorResult[]> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "index-1-full",
    KeyConditionExpression: "pk1 = :pk1",
    ExpressionAttributeValues: { ":pk1": "cintel" },
    ScanIndexForward: false,
  });
  const response = await docClient.send(command);
  return response.Items
    ? response.Items.map((item) => item.data as StoredOperatorResult)
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

const READY_SK = "ready";

export interface ReadyState {
  p1Ready: boolean;
  p2Ready: boolean;
  p1Phone?: string;
  p2Phone?: string;
}

export async function getReadyState(phone1: string): Promise<ReadyState> {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { pk: phone1, sk: READY_SK },
  });
  const response = await docClient.send(command);
  if (!response.Item) return { p1Ready: false, p2Ready: false };
  return {
    p1Ready: response.Item.p1Ready ?? false,
    p2Ready: response.Item.p2Ready ?? false,
    p1Phone: response.Item.p1Phone,
    p2Phone: response.Item.p2Phone,
  };
}

export async function putReadyState(
  phone1: string,
  update: Partial<ReadyState>
): Promise<ReadyState> {
  const current = await getReadyState(phone1);
  const newState = { ...current, ...update };
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: { pk: phone1, sk: READY_SK, ...newState },
  });
  await docClient.send(command);
  return newState;
}

export async function deleteReadyState(phone1: string): Promise<void> {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { pk: phone1, sk: READY_SK },
  });
  await docClient.send(command);
}
