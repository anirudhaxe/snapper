// eslint-disable-next-line
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "snapper",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { region: "eu-central-1" },
      },
    };
  },
  async run() {
    const connStringsEnv = new sst.Secret("DATABASE_CONN_STRINGS");
    const backupStorageDataEnv = new sst.Secret("BACKUP_STORAGE_DATA");

    const backupBucket = new sst.aws.Bucket("snapperDbBackupBucket");
    // TODO: setup a dead letter queue
    const createBackupQueue = new sst.aws.Queue("createBackupQueue");

    new sst.aws.Cron("cron-worker", {
      schedule: "rate(1 minute)",
      job: {
        handler: "functions/cron-worker/index.handler",
        timeout: "5 minutes",
        link: [connStringsEnv, backupStorageDataEnv, createBackupQueue],
      },
    });

    createBackupQueue.subscribe(
      {
        handler: "functions/create-backup-worker/index.handler",
        timeout: "5 minutes",
        link: [backupBucket],
      },
      { batch: { size: 1 } },
    );
  },
});
