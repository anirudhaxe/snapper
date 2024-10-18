import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  PutObjectCommandOutput,
  ListObjectsV2CommandOutput,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";

import fs from "fs";

const s3Client = new S3Client({ region: "eu-central-1" });

async function uploadS3Object(props: {
  bucket: string;
  key: string;
  filePath: string;
}): Promise<PutObjectCommandOutput> {
  const params = {
    Bucket: props.bucket,
    Key: props.key,
    Body: fs.createReadStream(props.filePath),
  };

  return s3Client.send(new PutObjectCommand(params));
}

async function listS3Objects(props: {
  bucket: string;
  prefix?: string;
}): Promise<ListObjectsV2CommandOutput> {
  const params = {
    Bucket: props.bucket,
    Prefix: props.prefix,
  };

  return s3Client.send(new ListObjectsV2Command(params));
}

async function deleteS3Object(props: {
  bucket: string;
  key: string;
}): Promise<DeleteObjectCommandOutput> {
  const params = {
    Bucket: props.bucket,
    Key: props.key,
  };

  return s3Client.send(new DeleteObjectCommand(params));
}

export { listS3Objects, uploadS3Object, deleteS3Object };
