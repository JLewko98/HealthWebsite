const {
  PutObjectCommand,
  createS3Client,
  getStorageConfig,
  headers,
  json,
} = require('./s3-helpers');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { status: 'error', message: 'Method not allowed' });
  }

  const { bucket, key, region, hasCredentials } = getStorageConfig();

  if (!hasCredentials) {
    return json(200, {
      status: 'unconfigured',
      message: 'S3 storage credentials are not configured.',
    });
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const logs = Array.isArray(payload.logs) ? payload.logs : [];

    const s3 = createS3Client(region);
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(logs, null, 2),
      ContentType: 'application/json',
    }));

    return json(200, { status: 'success' });
  } catch (error) {
    return json(500, {
      status: 'error',
      message: `Failed to save logs to S3: ${error.message || error}`,
    });
  }
};
