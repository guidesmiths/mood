const debug = require('debug')('guajirobot:mongo');
const { MongoClient } = require('mongodb');

module.exports = config => {
	const start = async () => {
		const mongo = await MongoClient.connect(config.url, config.options);
		const db = mongo.db(config.db);
		debug('Configuring db....');
		db.collection('users').createIndex({ id: 1 }, { unique: true });
		db.collection('audit').createIndex({ fn: 1, timestamp: 1, userId: 1 });
		db.collection('unmatched').createIndex({ language: 1, userId: 1 });
		db.collection('trivia').createIndex({ userId: 1 });

		const updateProfile = async profile => {
			debug('Updating profile...');
			const input = {
				id: profile.id,
				username: profile.username,
				isBot: profile.is_bot,
				firstName: profile.first_name,
				lastName: profile.last_name,
				languageCode: profile.language_code,
			};
			const response = await db.collection('users').findOneAndUpdate({ id: input.id }, { $set: input }, { upsert: true, returnNewDocument: true });
			return response;
		};

		const updateLanguage = async (userId, language) => {
			debug(`Updating language ${language}... for user ${userId}`);
			const input = {
				preferredLanguage: language,
			};
			const response = await db.collection('users').findOneAndUpdate({ id: userId }, { $set: input }, { upsert: true, returnNewDocument: true });
			return response;
		};

		const getUser = async userId => {
			debug(`Getting profile data for user ${userId}`);
			const response = await db.collection('users').findOne({ id: userId });
			return response;
		};

		const audit = async payload => {
			debug('Recording a new audited item...');
			await db.collection('audit').insertOne(payload);
		};

		const storeUnmatched = async payload => {
			debug('Storing unmatched output for given input...');
			await db.collection('unmatched').insertOne(payload);
		};

		const recordTriviaAnswer = async payload => {
			debug('Storing trivia outcome...');
			await db.collection('trivia').updateOne(
				{ userId: payload.userId, question: payload.question },
				{ $set: payload },
				{ upsert: true },
			);
		};

		const getTriviaAnswers = async userId => {
			debug(`Getting trivia answers for user ${userId}...`);
			const answers = await db.collection('trivia').find({ userId }).toArray();
			return answers;
		};

		return {
			updateProfile,
			updateLanguage,
			getUser,
			audit,
			storeUnmatched,
			recordTriviaAnswer,
			getTriviaAnswers,
		};
	};

	return {
		start,
	};
};
