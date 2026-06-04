import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.MISTECKA_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.MISTECKA_AWS_SECRET_ACCESS_KEY!
    }
});

export const S3_BUCKET_UPLOAD = process.env.MISTECKA_AWS_S3_BUCKET_UPLOAD!;
export const S3_BUCKET_RESIZED = process.env.MISTECKA_AWS_S3_BUCKET_RESIZED!;
