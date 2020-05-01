module.exports = {
	mood: {
		storeEngine: 's3'
	},
	server: {
		port: process.env.PORT || 3000,
	},
	db: {
		url: process.env.MONGO_URL || 'mongodb://user:pass@localhost:27017/mood',
		db: process.env.MONGO_DB || 'mood',
		options: { useNewUrlParser: true },
	},
	s3: {
		bucket: process.env.S3_BUCKET,
	}
};
