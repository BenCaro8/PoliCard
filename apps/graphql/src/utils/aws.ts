import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';

import 'dotenv/config';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
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
  console.log(`Uploaded to S3: ${fileName}`);
};

export const deleteFromS3 = async (fileName: string) => {
  try {
    const data = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
      }),
    );
    console.log('Deleted from S3:', data);
    return data;
  } catch (err) {
    console.log('S3 delete error:', err);
  }
};
