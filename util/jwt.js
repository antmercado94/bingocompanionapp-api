/**
 * Utility function for creating JWT (JSON Web Token)
 */

const jwt = require('jsonwebtoken');

/* create JWT */
const createToken = (payload, secret, maxAge) => {
	return jwt.sign(payload, secret, {
		expiresIn: maxAge,
	});
};

/* verify JWT */
const verifyToken = (token, secret) => {
	let tokenInfo = { isVerified: false, token: null };

	jwt.verify(token, secret, (err, decodedToken) => {
		if (err) {
			tokenInfo.isVerified = false;
		}
		if (decodedToken) {
			tokenInfo.isVerified = true;
			tokenInfo.token = decodedToken;
		}
	});

	return tokenInfo;
};

module.exports = { createToken, verifyToken };
