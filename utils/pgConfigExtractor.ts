const extractPgConfig = (connectionString: string) => {
  const regex = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;

  const match = connectionString.match(regex);

  if (!match) {
    throw new Error("Invalid PostgreSQL connection string format");
  }

  const [, user, password, host, port, database] = match;

  return {
    PGUSER: user,
    PGPASSWORD: password,
    PGHOST: host,
    PGDATABASE: database,
    PGPORT: port,
  };
};
export default extractPgConfig;
