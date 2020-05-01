const debug = require('debug')('mood:s3');
const AWS = require('aws-sdk');

module.exports = ({ bucket }) => {
    // use AWS_PROFILE if in local - lambda should have s3 permissions
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
	const start = async () => {
        
        const register = async point => {
            debug(`Storing in s3 for team ${point.team} pid ${point.id}...`);
            const params = {
                Body: JSON.stringify(point),
                Bucket: bucket,
                Key: `${point.team}/${point.id}`
            };
            await s3.putObject(params).promise();
            return point.id;
        };
        
        const unregister = async (pid, team) => {
            debug(`Unregistering from s3 pid ${pid} for team ${team}...`);
            const params = {
                Bucket: bucket,
                Key: `${team}/${pid}`
            };
            await s3.deleteObject(params).promise();
            return Promise.resolve();
        };
        
        const getMoodByTeam = async (team) => {
            debug(`Getting latest mood points for team ${team}...`);
            const searchParams = {
                Bucket: bucket,
                Prefix: `${team}/`
            };
            // XXX paginate to be able to deal with more than 1000 points, see "s3-ls" module
            const { Contents } = await s3.listObjectsV2(searchParams).promise();
            const points = Contents.map(object => {
                const point = JSON.parse(object.Body);
                return {
                    timestamp: new Date(point.timestamp).getTime(),
                    x: point.x,
                    y: point.y
                };
            });
            return points;
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
