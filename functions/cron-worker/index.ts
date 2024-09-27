import { Handler } from "aws-lambda";
import { variableProvider } from "./variableProvider";
export const handler: Handler = async (event, context) => {
  console.log(event, context);

  const input = variableProvider();

  console.log(input);
};
