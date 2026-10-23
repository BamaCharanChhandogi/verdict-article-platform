import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// Cloudflare R2 S3 Client (Account 1 credentials from global developer rules)
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || 'https://3476316e7f10ea19b2da6db63fbddd7a.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || 'b53f8809950dfdc44f17e178d643de80',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '2f5a761e9c12e2f1c15404ea848682112aa8548090839b54c6da1143ad444972',
  },
});

export const R2_BUCKET = process.env.R2_BUCKET || 'verdict-articles';
