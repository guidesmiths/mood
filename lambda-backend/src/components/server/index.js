const express = require('express'); // eslint-disable-line import/no-extraneous-dependencies
const bodyParser = require('body-parser'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = ({ port }) => {
	const start = async ({ controller }) => {
		const app = express();
		app.use(bodyParser.json());

		app.get('/:team/points', async (req, res) => {
			const team = req.params.team.toLowerCase();
			const points = await controller.checkMood(team);
			res.json(points);
		});

		app.post('/:team/points', async (req, res) => {
			const team = req.params.team.toLowerCase();
			const response = await controller.registerMood({
				...req.body,
				team,
			});
			res.json(response);
		});

		app.delete('/:team/points/:pid', async (req, res) => {
			const { pid } = req.params;
			const { team } = req.params;
			await controller.unregisterMood(pid, team);
			res.sendStatus(200);
		});

		app.listen(port, () => {
			console.log(`Express server is listening on ${port}`);
		});
	};

	return { start };
};