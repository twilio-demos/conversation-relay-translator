import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const dynClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(dynClient);

export const lambdaHandler = async (event, context) => {
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    // Extract workerHandle from query parameters
    const workerHandle = event.queryStringParameters?.workerHandle;

    // Validate that workerHandle is provided
    if (!workerHandle) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Missing required query parameter: workerHandle",
        }),
      };
    }

    console.log("Worker Handle:", workerHandle);

    // Query DynamoDB for profile with matching flexWorker
    const scanResult = await ddbDocClient.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME,
        FilterExpression: "flexWorkerHandle = :workerHandle AND sk = :profile",
        ExpressionAttributeValues: {
          ":workerHandle": workerHandle,
          ":profile": "profile",
        },
      })
    );

    console.log("Scan Result:", JSON.stringify(scanResult, null, 2));

    // Check if profile was found
    if (!scanResult.Items || scanResult.Items.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "No profile found for the given workerHandle",
          workerHandle: workerHandle,
        }),
      };
    }

    const profile = scanResult.Items[0];

    const callerPhone = profile.pk;

    const activeConversationConnection = await ddbDocClient.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME,
        FilterExpression: "#from = :callerPhone AND callStatus = :connected",
        ExpressionAttributeNames: {
          "#from": "From",
        },
        ExpressionAttributeValues: {
          ":callerPhone": callerPhone,
          ":connected": "connected",
        },
      })
    );

    // Check if profile was found
    if (
      !activeConversationConnection.Items ||
      activeConversationConnection.Items.length === 0
    ) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "No profile found for the given workerHandle",
          workerHandle: workerHandle,
        }),
      };
    }

    const activeConnection = activeConversationConnection.Items[0];
    const parentConnectionId = activeConnection.parentConnectionId;

    const conversationMessages = await ddbDocClient.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression:
          "pk = :parentConnectionId AND begins_with(sk, :spokenText)",
        ExpressionAttributeValues: {
          ":parentConnectionId": parentConnectionId,
          ":spokenText": "spokenText::",
        },
      })
    );

    const messages = conversationMessages.Items ?? [];

    const response = {
      message: "Active conversation retrieved",
      messages,
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
