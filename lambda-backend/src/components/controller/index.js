const debug = require('debug')('mood:controller');
const uuid = require('uuid').v4;

module.exports = () => {
	const start = async (store) => {

		const checkMood = async (team) => {
            const mood = await store.getMoodByTeam(team);
			return mood;
		};

		const registerMood = async input => {
            const timestamp = new Date().getTime();
            const point = {...input, timestamp};
            const id = [input.team, uuid(), input.x, input.y, timestamp].join(':');
			debug(`Storing pid ${id} for team ${input.team}...`);
            await store.register({
                ...point,
                id,
            });
			return { pid: id };
		};

		const unregisterMood = async (pid, team) => {
			debug(`Unregistering pid ${pid} for team ${team}...`);
			await store.unregister(pid, team);
			return Promise.resolve();
		};

		return {
			checkMood,
			registerMood,
			unregisterMood,
		};
	};

	return {
		start,
	};
};
