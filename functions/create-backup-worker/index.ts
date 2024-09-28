import { Handler } from "aws-lambda";
import { InputData } from "~/types/globals";

export const handler: Handler = async (event) => {
  // TODO: handle the event records array
  const message = JSON.parse(event.Records[0].body) as InputData;

  // TODO: handle this error
  if (!message) {
    return;
  }
  console.log(message);

  return "ok";
};
