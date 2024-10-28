// DATABASE_CONN_STRINGS = key1db,postgresql://postgres:password@localhost:5432/db1,POSTGRES|key2db,postgresql://postgres:password@localhost:5432/db2,POSTGRES|key3db,postgresql://postgres:password@localhost:5432/db3,POSTGRES
type connectionData = {
  dbkey: string; // unique db identifier
  dbConnString: string;
  dbType: DbType;
};
type DbType = "POSTGRES" | "MONGO" | "MYSQL";

// BACKUP_STORAGE_DATA = key1db,2|key2db,4|key3db,3
type backupStorageData = {
  dbKey: string; // unique db identifier
  retentionPeriod: number;
};

export { connectionData, backupStorageData, DbType };
