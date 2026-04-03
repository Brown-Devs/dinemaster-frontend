import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY
    }
});

export async function POST(req) {
    try {
        const { key } = await req.json();

        if (!key) {
            return Response.json({ error: "Key is required" }, { status: 400 });
        }

        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.CLOUDFLARE_R2_BUCKET,
                Key: key
            })
        );

        return Response.json({ success: true });
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Delete failed" }, { status: 500 });
    }
}