// DATABASE_CONN_STRINGS = postgresql://postgres:password@localhost:5432/db1,POSTGRES|postgresql://postgres:password@localhost:5432/db2,POSTGRES|postgresql://postgres:password@localhost:5432/db3,POSTGRES
type connectionData = {
  dbConnString: string;
  dbType: DbType;
};
type DbType = "POSTGRES" | "MONGO" | "MYSQL";

// BACKUP_STORAGE_DATA = bucket1/db1,2|bucket2/db2,8
type backupStorageData = {
  backupDirKey: string;
  retentionPeriod: number;
};

type InputData = {
  connectionData: connectionData[];
  backupStorageData: backupStorageData[];
};

export { InputData, DbType };
