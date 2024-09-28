import { Handler } from "aws-lambda";
import { variableProvider } from "./variableProvider";
import { Resource } from "sst";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient();

export const handler: Handler = async () => {
  const input = variableProvider();

  // send a message
  await client.send(
    new SendMessageCommand({
      QueueUrl: Resource.createBackupQueue.url,
      MessageBody: JSON.stringify(input),
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "sent" }, null, 2),
  };
};
