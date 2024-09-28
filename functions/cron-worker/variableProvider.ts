import { Resource } from "sst";
import type {
  connectionData,
  backupStorageData,
  DbType,
} from "~/types/globals";

export const variableProvider: variableProvider = () => {
  const connectionDataEnv = Resource.DATABASE_CONN_STRINGS.value;

  const backupStorageDataEnv = Resource.BACKUP_STORAGE_DATA.value;

  if (!connectionDataEnv || !backupStorageDataEnv)
    throw new Error(
      "please provide DATABASE_CONN_STRINGS and BACKUP_STORAGE_DATA env variables",
    );

  return {
    connectionData: connectionDataEnv.split("|").map((connectionData) => {
      const arr = connectionData.split(",");

      return {
        dbConnString: arr[0],
        dbType: arr[1] as DbType,
      };
    }),

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
  connectionData: connectionData[];
  backupStorageData: backupStorageData[];
};