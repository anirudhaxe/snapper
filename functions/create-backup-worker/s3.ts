import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const s3Client = new S3Client({ region: "eu-central-1" });

async function uploadToS3(props: {
  bucket: string;
  key: string;
  filePath: string;
}) {
  const params = {
    Bucket: props.bucket,
    Key: props.key,
    Body: fs.createReadStream(props.filePath),
  };

  const data = await s3Client.send(new PutObjectCommand(params));
  console.log("Success", data);
}

export default uploadToS3;
