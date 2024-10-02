import { Handler } from "aws-lambda";
import { variableProvider } from "./variableProvider";
import { Resource } from "sst";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient();

export const handler: Handler = async (_, context) => {
  try {
    const input = variableProvider();

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

    const deleteQueuePromises = input.backupStorageData.map(
      (backupStorageData) => {
        return client.send(
          new SendMessageCommand({
            QueueUrl: Resource.deleteBackupQueue.url,
            MessageBody: JSON.stringify(backupStorageData),
          }),
        );
      },
    );

    await Promise.all(deleteQueuePromises);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `messages successfully processed by cron job ${(input.connectionData, input.backupStorageData)}`,
        },
        null,
        2,
      ),
    };
  } catch (error) {
    console.error(`caught error in REQUEST_ID: ${context.awsRequestId}`, error);

    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "an unexpected error occurred",
        },
        null,
        2,
      ),
    };
  }
};
