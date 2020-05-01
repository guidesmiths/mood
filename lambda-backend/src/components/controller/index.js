const debug = require('debug')('mood:controller');
const uuid = require('uuid').v4;

module.exports = () => {
	const start = async (store) => {
        
		const checkMood = async (team) => {
            const mood = await store.getMoodByTeam(team);
			return mood;
		};

		const registerMood = async input => {
            const point = {...input, timestamp: new Date()};
            const id = `${input.team}-${uuid()}-${input.x}-${input.y}`;
			debug(`Storing pid ${pid} for team ${input.team}...`);
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
