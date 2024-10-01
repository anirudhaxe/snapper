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
    // TODO: setup a dead letter queue and check lambda error state
    const createBackupQueue = new sst.aws.Queue("createBackupQueue");

    new sst.aws.Cron("cron-worker", {
      // TODO: make this once a day
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
        // TODO: figure out this timeout
        // timeout: "5 minutes",
        link: [backupBucket],
        copyFiles: [
          {
            from: "bin/postgres-16.3/libpq.so.5",
            to: "functions/create-backup-worker/bin/postgres-16.3/libpq.so.5",
          },
          {
            from: "bin/postgres-16.3/pg_dump",
            to: "functions/create-backup-worker/bin/postgres-16.3/pg_dump",
          },
        ],
      },
      { batch: { size: 1 } },
    );
  },
});
