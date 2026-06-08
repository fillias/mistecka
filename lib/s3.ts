import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
    region: process.env.MISTECKA_AWS_REGION!,
    credentials: {
        accessKeyId: process.env.MISTECKA_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.MISTECKA_AWS_SECRET_ACCESS_KEY!
    }
});

export const S3_BUCKET_UPLOAD = process.env.MISTECKA_AWS_S3_BUCKET_UPLOAD!;
export const S3_BUCKET_RESIZED = process.env.MISTECKA_AWS_S3_BUCKET_RESIZED!;

// Extrahuje S3 klíč z URL (https://bucket.s3.region.amazonaws.com/KEY)
export function keyFromUrl(url: string): string | null {
    try {
        const { pathname } = new URL(url);
        return pathname.startsWith('/') ? pathname.slice(1) : pathname;
    } catch {
        return null;
    }
}

export async function deleteS3Objects(bucket: string, keys: string[]) {
    const validKeys = keys.filter(Boolean);
    if (validKeys.length === 0) return;

    const result = await s3.send(
        new DeleteObjectsCommand({
            Bucket: S3_BUCKET_RESIZED,
            Delete: { Objects: validKeys.map((Key) => ({ Key })) }
        })
    );
    console.log('result: ', result);
}
