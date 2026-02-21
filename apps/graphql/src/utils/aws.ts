import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
import camelcaseKeys from 'camelcase-keys';
import pgPromise from 'pg-promise';

import 'dotenv/config';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const pgp = pgPromise({
  receive(e) {
    // @ts-expect-error rows unexpected for some reason...
    e.result.rows = camelcaseKeys(e.data, { deep: true });
  },
});

export const dbPool = pgp({
  host: process.env.APPDATA_DB_URL,
  user: process.env.APPDATA_DB_USER,
  password: process.env.APPDATA_DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

export let dbConnectionReady = false;

dbPool
  .connect()
  .then((obj) => {
    console.log('Database connection successful');
    dbConnectionReady = true;
    obj.done(); // Release the connection back to the pool
  })
  .catch((error) => {
    console.error('ERROR:', error.message || error);
  });

export const uploadToS3 = async (audioStream: Readable, fileName: string) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: Readable.from(audioStream),
      ContentType: 'audio/mpeg',
      ACL: 'public-read',
    },
  });

  upload.on('httpUploadProgress', (progress) => {
    console.log(progress);
  });

  await upload.done();
  console.log(`Audio uploaded successfully to S3: ${fileName}`);
};

export const deleteFromS3 = async (fileName: string) => {
  try {
    const data = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
      }),
    );
    console.log('Success. Object deleted.', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};
