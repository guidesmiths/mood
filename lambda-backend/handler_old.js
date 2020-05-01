// XXX include simple rate limiter

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const uuid = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

module.exports.points = async (event, _, callback) => {
  const team = event.pathParameters.team.toLowerCase();

  switch (event.httpMethod) {
  case 'GET': // GET /{team}/points
    const searchParams = {
      Bucket: process.env.S3_BUCKET,
      Prefix: `${team}/`
    };

    try {
      // XXX paginate to be able to deal with more than 1000 points, see "s3-ls" module
      const result = await s3.listObjectsV2(searchParams).promise();
      const points = result.Contents.map(object => {
        const point = JSON.parse(object.Body);
        return {
          timestamp: new Date(point.timestamp).getTime(),
          x: point.x,
          y: point.y
        };
      });
      callback(null, buildSuccessBody(points));
    } catch (err) {
      callback(null, buildErrorBody(err));
    }

    break;

  case 'POST': // POST /{team}/points
    const point = {...JSON.parse(event.body), timestamp: new Date()};

    const pid = `${team}-${uuid()}-${point.x}-${point.y}`;

    const params = {
      Body: JSON.stringify(point), // only <binary | string> accepted
      Bucket: process.env.S3_BUCKET,
      Key: `${team}/${pid}`
    };

    try {
      await s3.putObject(params).promise();
      callback(null, buildSuccessBody({pid: pid}));
    } catch (err) {
      callback(null, buildErrorBody(err));
    }

    break;

  case 'DELETE': // DELETE /{team}/points/{pid}
    const deleteParams = {
      Bucket: process.env.S3_BUCKET,
      Key: `${team}/${event.pathParameters.pid}`
    };

    try {
      await s3.deleteObject(deleteParams).promise();
      callback(null, buildSuccessBody());
    } catch (err) {
      callback(null, buildErrorBody(err));
    }

    break;
  default:
    callback(null, buildErrorBody(err, 405));
    break;
  }
};

function buildErrorBody(err, code = 500) {
  console.error(err);
  return { statusCode: code };
}

function buildSuccessBody(data = {}) {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: { 'Access-Control-Allow-Origin' : '*' } // XXX review whether this header is needed for CORS support
  };
}