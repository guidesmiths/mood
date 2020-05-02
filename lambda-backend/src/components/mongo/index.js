const debug = require('debug')('mood:mongo');
const { MongoClient } = require('mongodb');

module.exports = config => {
	const start = async () => {
		const mongo = await MongoClient.connect(config.url, config.options);
		const db = mongo.db(config.db);
		debug('Configuring db....');
		db.collection('points').createIndex({ id: 1 }, { unique: true });
		db.collection('points').createIndex({ level1: 1, level2: 1, level3: 1 }, { sparse: true });
		db.collection('points').createIndex({ team: 1, timestamp: 1 });

		const getMoodByTeam = async team => {
			debug(`Getting latest mood points from mongo for team ${team}...`);
			const points = await db.collection('points').find({ team }).toArray();
			return points.map(point => ({
				timestamp: new Date(parseInt(point.timestamp, 10)),
				x: point.x,
				y: point.y,
			}));
		};

		const register = async point => {
			debug(`Storing in mongo for team ${point.team} pid ${point.id}...`);
			await db.collection('points').insertOne(point);
			return point.id;
		};

		const unregister = async (pid, team) => {
			debug(`Unregistering from mongo pid ${pid} for team ${team}...`);
			await db.collection('points').deleteOne({ id: pid });
			return Promise.resolve();
		};

		return {
			getMoodByTeam,
			register,
			unregister,
		};
	};

	return {
		start,
	};
};
