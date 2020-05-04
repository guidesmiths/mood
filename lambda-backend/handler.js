require('dotenv').config({ path: `.env.${process.env.SERVICE_ENV || 'local'}` });
const system = require('./src/system');

module.exports.process = async event => {
	const team = event.pathParameters.team.toLowerCase();
	let controller;
	
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
			const points = await controller.checkMood(team);
			return points;
		},
		POST: async () => {
			const outcome = await controller.registerMood({
				...JSON.parse(event.body),
				team,
			});
			return outcome;
		},
		DELETE: async () => {
			const { pid } = event.pathParameters;
			await controller.unregisterMood(pid, team);
		},
	};

	try {
		controller = await system.start();
		console.log(`Picking handler for method ${event.httpMethod}...`);
		const handler = handlerByMethod[event.httpMethod];
		if (!handler) return buildErrorBody(null, 405);
		const output = await handler();
		return buildSuccessBody(output);
	} catch (err) {
		return buildErrorBody(err);
	}
};
