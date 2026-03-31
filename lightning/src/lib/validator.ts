import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
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

export class Validator {
  static async checkPhoneNumberUsed(
    phoneNumber: string | null
  ): Promise<boolean> {
    if (!phoneNumber) {
      return false;
    }

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        pk: phoneNumber,
        sk: "profile",
      },
    });

    const response = await docClient.send(command);
    return response.Item ? true : false;
  }

  static async checkFlexWorkerUsed(
    flexWorkerHandle: string | null
  ): Promise<boolean> {
    if (!flexWorkerHandle) {
      return false;
    }

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "index-1-full",
      KeyConditionExpression: "pk1 = :pk1",
      ExpressionAttributeValues: {
        ":pk1": "profile",
        ":flexWorkerHandle": flexWorkerHandle,
      },
      FilterExpression: "flexWorkerHandle = :flexWorkerHandle",
    });

    const response = await docClient.send(command);
    return response.Items && response.Items.length > 0 ? true : false;
  }
}
