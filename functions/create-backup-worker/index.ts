import { Handler } from "aws-lambda";
import { connectionData } from "~/types/globals";
import extractPgConfig from "~/utils/pgConfigExtractor";
import config from "./config";
import pgdump from "./pgdump";
import { uploadS3Object } from "~/utils/s3";
import { Resource } from "sst";

export const handler: Handler = async (event, context) => {
  try {
    const message = JSON.parse(event.Records[0].body) as connectionData;

    // TODO: handle this error
    if (!message) {
      return;
    }

    const dbConfig = extractPgConfig(message.dbConnString);

    const { fileName, filePath } = await pgdump({ ...config, ...dbConfig });

    await uploadS3Object({
      bucket: Resource.snapperDbBackupBucket.name,
      key: `${message.dbkey}/${fileName}`,
      filePath: filePath,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(
        { message: `backup created ${message.dbkey}/${fileName}` },
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
