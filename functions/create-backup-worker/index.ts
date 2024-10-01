import { Handler } from "aws-lambda";
import { connectionData } from "~/types/globals";
import extractPgConfig from "~/utils/pgConfigExtractor";
import config from "./config";
import pgdump from "./pgdump";
import uploadToS3 from "./s3";
import { Resource } from "sst";

export const handler: Handler = async (event, context) => {
  try {
    const message = JSON.parse(event.Records[0].body) as connectionData;

    // TODO: handle this error
    if (!message) {
      return;
    }
    console.log("MESSAGE:", message, "REQUEST_ID: ", context.awsRequestId);

    const dbConfig = extractPgConfig(message.dbConnString);

    const { fileName, filePath } = await pgdump({ ...config, ...dbConfig });

    await uploadToS3({
      bucket: Resource.snapperDbBackupBucket.name,
      key: `${message.dbkey}/${fileName}`,
      filePath: filePath,
    });

    return "ok";
  } catch (error) {
    console.error("Caught error:", error);
  }
};
