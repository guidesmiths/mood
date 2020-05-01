require('dotenv').config({ path: `.env.${process.env.SERVICE_ENV || 'local'}` });
const AWS = require('aws-sdk');
const system = require('./src/system');

module.exports.process = async event => {
  const team = event.pathParameters.team.toLowerCase();
  const controller = await system.start();

  switch (event.httpMethod) {
    case 'GET': // GET /{team}/points
        try {
            const point = await controller.checkMood(team);
            return buildSuccessBody(points);
        }
        catch (err) {
            return buildErrorBody(err);
        }

    case 'POST': // POST /{team}/points
        try {
			const outcome = await controller.registerMood({
                ...JSON.parse(event.body),
                team,
            });
            return buildSuccessBody(outcome);
        }
        catch (err) {
            return buildErrorBody(err);
        }

    case 'DELETE': // DELETE /{team}/points/{pid}
        try {
            const pid = event.pathParameters.pid;
            await controller.unregisterMood(pid, team);
            return buildSuccessBody();
        }
        catch (err) {
            return buildErrorBody(err);
        }
    default:
        return buildErrorBody(err, 405);
    }
};

const buildErrorBody = (err, code = 500) => {
  console.error(err);
  return { statusCode: code };
}

const buildSuccessBody = (data = {}) => {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: { 'Access-Control-Allow-Origin' : '*' } // XXX review whether this header is needed for CORS support
  };
}