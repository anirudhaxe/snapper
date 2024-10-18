import { Handler } from "aws-lambda";
import { listS3Objects, deleteS3Object } from "~/utils/s3";
import { backupStorageData } from "~/types/globals";
import { Resource } from "sst";

export const handler: Handler = async (event, context) => {
  try {
    const message = JSON.parse(event.Records[0].body) as backupStorageData;

    console.log(`delete backup request for db Key- ${message.dbKey}`);

    // TODO: handle this error
    if (!message) {
      return;
    }

    const bucketObjects = await listS3Objects({
      bucket: Resource.snapperDbBackupBucket.name,
      prefix: `${message.dbKey}/`,
    });

    console.log(
      `for db Key- ${message.dbKey} found bucket objects: `,
      bucketObjects.Contents,
    );

    if (
      bucketObjects.Contents &&
      bucketObjects.Contents.length > Number(message.retentionPeriod)
    ) {
      const sortedObjectsArray = bucketObjects.Contents.sort((a, b) => {
        if (a.LastModified && b.LastModified) {
          return a.LastModified.getTime() - b.LastModified.getTime();
        } else {
          return 0;
        }
      });

      const numberOfExtraBackups =
        bucketObjects.Contents.length - Number(message.retentionPeriod);
      const extraObjects = sortedObjectsArray.slice(0, numberOfExtraBackups);

      const deletePromises = extraObjects.map((object) => {
        return deleteS3Object({
          bucket: Resource.snapperDbBackupBucket.name,
          key: `${object.Key}`,
        });
      });

      console.log(
        `for DB key- ${message.dbKey}: `,
        "allowed backups: ",
        `${Number(message.retentionPeriod)} `,
        "found backups: ",
        `${bucketObjects.Contents.length}`,
      );

      console.log("trying to delete backups: ", extraObjects);

      await Promise.all(deletePromises);

      console.log("successfully deleted backups: ", extraObjects);

      return {
        statusCode: 200,
        body: JSON.stringify(
          { message: `successfully deleted backups ${extraObjects}` },
          null,
          2,
        ),
      };
    } else {
      console.log(
        `for DB key- ${message.dbKey}: `,
        "allowed backups: ",
        `${Number(message.retentionPeriod)} `,
        "found backups: ",
        `${bucketObjects.Contents?.length} `,
        "thus found no backups that needs to be deleted",
      );

      return {
        statusCode: 200,
        body: JSON.stringify(
          { message: "found no backups that needs to be deleted" },
          null,
          2,
        ),
      };
    }
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
