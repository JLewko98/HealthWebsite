const { GetObjectCommand, PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
}

function getStorageConfig() {
  const bucket = process.env.S3_BUCKET_NAME || 'healthwebsitejl';
  const key = process.env.S3_LOGS_KEY || 'health-logs.json';
  const region = process.env.JL_AWS_REGION || 'us-east-1';

  const hasCredentials =
    Boolean(process.env.JL_AWS_ACCESS_KEY_ID) &&
    Boolean(process.env.JL_AWS_SECRET_ACCESS_KEY);

  return { bucket, key, region, hasCredentials };
}

function createS3Client(region) {
  return new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.JL_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.JL_AWS_SECRET_ACCESS_KEY,
    },
  });
}

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

module.exports = {
  GetObjectCommand,
  PutObjectCommand,
  createS3Client,
  getStorageConfig,
  headers,
  json,
  streamToString,
};
