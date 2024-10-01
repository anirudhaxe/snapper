import { Handler } from "aws-lambda";
import { variableProvider } from "./variableProvider";
import { Resource } from "sst";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient();

export const handler: Handler = async (_, context) => {
  const input = variableProvider();

  console.log("REQUEST_ID: ", context.awsRequestId);

  const promiseArr = input.connectionData.map((connectionData) => {
    // send a message
    return client.send(
      new SendMessageCommand({
        QueueUrl: Resource.createBackupQueue.url,
        MessageBody: JSON.stringify(connectionData),
      }),
    );
  });

  await Promise.all(promiseArr);

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "sent" }, null, 2),
  };
};
