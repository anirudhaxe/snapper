import { Resource } from "sst";

export const variableProvider: variableProvider = () => {
  // DATABASE_CONN_STRINGS = postgresql://postgres:password@localhost:5432/db1|postgresql://postgres:password@localhost:5432/db2|postgresql://postgres:password@localhost:5432/db3
  const connStringsEnv = Resource.DATABASE_CONN_STRINGS.value;

  // BACKUP_STORAGE_DATA = bucket1/db1,2|bucket2/db2,8
  const backupStorageDataEnv = Resource.BACKUP_STORAGE_DATA.value;

  if (!connStringsEnv || !backupStorageDataEnv)
    throw new Error(
      "please provide DATABASE_CONN_STRINGS and BACKUP_STORAGE_DATA env variables",
    );

  return {
    databaseConnStrings: connStringsEnv.split("|"),
    backupStorageData: backupStorageDataEnv.split("|").map((bucketData) => {
      const arr = bucketData.split(",");

      return {
        backupDirKey: arr[0],
        retentionPeriod: Number(arr[1]),
      };
    }),
  };
};

type variableProvider = () => {
  databaseConnStrings: string[];
  backupStorageData: { backupDirKey: string; retentionPeriod: number }[];
};
