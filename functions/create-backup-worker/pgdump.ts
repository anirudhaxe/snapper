import { exec } from "child_process";
import path from "path";
import type config from "./config";
import type extractPgConfig from "~/utils/pgConfigExtractor";
import fs from "fs";

type ResolveObject = {
  fileName: string;
  filePath: string;
};

async function pgdump(
  event: typeof config & ReturnType<typeof extractPgConfig>,
) {
  return new Promise<ResolveObject>((resolve, reject) => {
    // set file name, file path
    const date = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")
      .replace(" ", "_");

    const format = ".backup";
    const args = "-Fc -Z1";

    const fileName = `${event.PGDATABASE}-${date}${format}`;
    const filePath = path.join("/tmp", `${fileName}`);

    // TODO: refactor child process spawning in a separate function
    const pgDumpPath = path.join(event.PGDUMP_PATH, "pg_dump");

    if (!fs.existsSync(pgDumpPath)) {
      throw new Error("pg_dump not found at " + pgDumpPath);
    }
    // spawn child process to execute pg_dump
    const child = exec(`${pgDumpPath} ${args}> ${filePath}`, {
      env: {
        LD_LIBRARY_PATH: event.PGDUMP_PATH,
        PGDATABASE: event.PGDATABASE,
        PGUSER: event.PGUSER,
        PGPASSWORD: event.PGPASSWORD,
        PGHOST: event.PGHOST,
        PGPORT: event.PGPORT,
      },
    });

    let stderr = "";

    // hook into the process
    child.stderr?.on("data", (data) => {
      stderr += data.toString("utf8");
    });

    // when child process exits
    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error("pg_dump process failed: " + stderr));
      }

      // check the PGDMP string to test whether pgdump wrote the correct file
      exec(`head -n 1 ${filePath}`, (error, stdout) => {
        if (stdout.startsWith("PGDMP")) {
          // correct output, if expected string is found at the first line of the file
          return resolve({
            fileName,
            filePath,
          });
        } else {
          return reject(new Error(`pg_dump failed, unexpected error`));
        }
      });
    });
  });
}

export default pgdump;
