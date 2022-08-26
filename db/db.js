/**
 * Connect to database
 */

const mongoose = require('mongoose');

module.exports = {
	connectToDb: (cb) => {
		mongoose
			.connect(process.env.MONGO_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then((result) => {
				return cb();
			})
			.catch((err) => {
				return cb(err);
			});
	},
};
