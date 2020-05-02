require('dotenv').config({ path: `.env.${process.env.SERVICE_ENV || 'local'}` });
const config = require('../config');
const initMongo = require('./components/mongo');
const initS3 = require('./components/s3');
const initController = require('./components/controller');

module.exports.start = async () => {
	const { storeEngine } = config.mood;
	console.log(`Starting mood system with store ${storeEngine}`);
	const storeHandler = {
		mongo: initMongo(config.mongo),
		s3: initS3(config.s3),
	};
	const store = await (storeHandler[storeEngine] || storeHandler.s3).start();
	const controller = await initController().start(store);
	return controller;
};
