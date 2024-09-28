import { Handler } from "aws-lambda";
import { connectionData } from "~/types/globals";

export const handler: Handler = async (event, context) => {
  const message = JSON.parse(event.Records[0].body) as connectionData;

  // TODO: handle this error
  if (!message) {
    return;
  }
  console.log("MESSAGE:", message, "REQUEST_ID: ", context.awsRequestId);

  return "ok";
};
