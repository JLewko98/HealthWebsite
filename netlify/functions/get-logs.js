const {
  GetObjectCommand,
  createS3Client,
  getStorageConfig,
  headers,
  json,
  streamToString,
} = require('./s3-helpers');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const { bucket, key, region, hasCredentials } = getStorageConfig();

  if (!hasCredentials) {
    return json(200, {
      status: 'unconfigured',
      message: 'S3 storage credentials are not configured.',
      logs: [],
    });
  }

  try {
    const s3 = createS3Client(region);
    const result = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const body = await streamToString(result.Body);
    const parsed = body ? JSON.parse(body) : [];

    return json(200, {
      status: 'success',
      logs: Array.isArray(parsed) ? parsed : parsed.logs || [],
    });
  } catch (error) {
    const code = error.name || error.Code;

    if (code === 'NoSuchKey' || code === 'NotFound') {
      return json(200, { status: 'success', logs: [] });
    }

    return json(200, {
      status: 'error',
      message: `Failed to fetch logs from S3: ${error.message || error}`,
      logs: [],
    });
  }
};
