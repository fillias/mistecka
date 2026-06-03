import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

/* lambda fn ktera vytahne nahrany obrazek 
z s3://mistecka-app-images-upload-395409815261-eu-central-1-an
vytvori 2 velikosti obrazku,
uploadne je do 
s3://mistecka-app-images-resized-395409815261-eu-central-1-an
a puvodni smaze

*/

const s3 = new S3Client({ region: 'eu-central-1' });

export const handler = async (event) => {
    try {
        const srcBucket = event.Records[0].s3.bucket.name;
        const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

        console.log(`Processing ${srcKey} from ${srcBucket}`);

        const { Body } = await s3.send(
            new GetObjectCommand({
                Bucket: srcBucket,
                Key: srcKey
            })
        );

        const imageBuffer = Buffer.from(await Body.transformToByteArray());

        // Rozděl cestu na složku a název souboru
        const srcDir = srcKey.substring(0, srcKey.lastIndexOf('/'));
        const srcFile = srcKey.substring(srcKey.lastIndexOf('/') + 1);

        const sizes = [
            { suffix: 'large', width: 1200 },
            { suffix: 'small', width: 400 }
        ];

        const promises = sizes.map(async ({ suffix, width }) => {
            const resizedBuffer = await sharp(imageBuffer)
                .resize({ width, withoutEnlargement: false })
                .webp({ quality: 80 })
                .toBuffer();

            // mistecka-app-images-upload-395409815261-eu-central-1-an/loupenicka/3/238fbdef-631d-4017-b8f3-74cf1682a4e5.jpeg
            const destKey = `${srcDir}/resized/${suffix}/${srcFile}`;

            await s3.send(
                new PutObjectCommand({
                    Bucket: 'mistecka-app-images-resized-395409815261-eu-central-1-an',
                    Key: destKey,
                    Body: resizedBuffer,
                    ContentType: 'image/webp',
                    CacheControl: 'public, max-age=31536000, immutable'
                })
            );

            console.log(`Created ${destKey}`);

            await s3.send(
                new DeleteObjectCommand({
                    Bucket: srcBucket,
                    Key: srcKey
                })
            );

            console.log(`Deleted original ${srcKey} from ${srcBucket}`);
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
