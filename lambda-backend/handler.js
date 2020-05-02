require('dotenv').config({ path: `.env.${process.env.SERVICE_ENV || 'local'}` });
const system = require('./src/system');

module.exports.process = async event => {
	const team = event.pathParameters.team.toLowerCase();
	const controller = await system.start();

	const buildErrorBody = (err, code = 500) => {
		console.error(err);
		return { statusCode: code };
	};

	const buildSuccessBody = (data = {}) => ({
		statusCode: 200,
		body: JSON.stringify(data),
		headers: { 'Access-Control-Allow-Origin': '*' }, // XXX review whether this header is needed for CORS support
	});

	const handlerByMethod = {
		GET: async () => {
			try {
				const points = await controller.checkMood(team);
				return buildSuccessBody(points);
			} catch (err) {
				return buildErrorBody(err);
			}
		},
		POST: async () => {
			try {
				const outcome = await controller.registerMood({
					...JSON.parse(event.body),
					team,
				});
				return buildSuccessBody(outcome);
			} catch (err) {
				return buildErrorBody(err);
			}
		},
		DELETE: async () => {
			try {
				const { pid } = event.pathParameters;
				await controller.unregisterMood(pid, team);
				return buildSuccessBody();
			} catch (err) {
				return buildErrorBody(err);
			}
		},
		DEFAULT: async () => buildErrorBody(null, 405),
	};

	const handler = handlerByMethod[event.httpMethod] || handlerByMethod.DEFAULT;
	await handler();
};
