import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const REGION = process.env.AWS_REGION;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export const getFileUrl = (subUrl) => {
  return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${subUrl}`;
}

export const generatePresignedUrl = async (objectKey) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: objectKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
    return signedUrl;
  } catch (err) {
    console.error("Error", err);
  }
};

const getObjects = async (length, base) => {
  const objects = [];
  const attachmentUrls = [];
  for (let i = 0; i < length; i++) {
    const objectKey = `${base}/${uuidv4()}`;
    objects.push(objectKey);
    attachmentUrls.push(getFileUrl(objectKey));
  }
  return { objects, attachmentUrls };
};

export const generatePresignedUrls = async (length, base) => {
  try {
    const { attachmentUrls, objects } = await getObjects(length, base);
    let signedUrls = [];
    for (const element of objects) {
      signedUrls.push(await generatePresignedUrl(element));
    }
    return { signedUrls, attachmentUrls };
  } catch (err) {
    console.error("Error", err);
  }
};

export const deleteObject = async (objectKey) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: objectKey,
    });

    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error('Error deleting object:', error);
  }
};

export const deleteObjects = async (base, objectKeys) => {
  try {
    objectKeys = objectKeys.map((element) => element.split(base)[1]);
    const response = [];
    for (const element of objectKeys) {
      response.push(await deleteObject(element));
    }
    return response;
  } catch (error) {
    console.error('Error deleting object:', error);
  }
};