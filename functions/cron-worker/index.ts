import { Handler } from "aws-lambda";
import { variableProvider } from "./variableProvider";
import { Resource } from "sst";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient();

export const handler: Handler = async (_, context) => {
  const input = variableProvider();

  console.log("REQUEST_ID: ", context.awsRequestId);

  input.connectionData.map(async (connectionData) => {
    // send a message
    await client.send(
      new SendMessageCommand({
        QueueUrl: Resource.createBackupQueue.url,
        MessageBody: JSON.stringify(connectionData),
      }),
    );
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "sent" }, null, 2),
  };
};
