module.exports = {
	mood: {
		storeEngine: process.env.STORE_ENGINE || 's3',
	},
	server: {
		port: process.env.PORT || 3000,
	},
	mongo: {
		url: process.env.MONGO_URL || 'mongodb://user:pass@localhost:27017/mood',
		db: process.env.MONGO_DB || 'mood',
		options: { useNewUrlParser: true, useUnifiedTopology: true },
	},
	s3: {
		bucket: process.env.S3_BUCKET,
	},
};
