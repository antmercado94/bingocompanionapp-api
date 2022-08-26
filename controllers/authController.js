/**
 * Auth related functions
 */

const User = require('../models/Users');
const { createToken, verifyToken } = require('../util/jwt');
const { handleErrors } = require('../helpers/handleErrors');

/* check for verified user */
module.exports.check_user = async (req, res) => {
	const reqToken = req.cookies.jwt;
	try {
		/** check cookie */
		if (!reqToken) return res.status(204).json();

		/** check token */
		const { isVerified, token } = verifyToken(
			reqToken,
			process.env.ACCESS_TOKEN_SECRET
		);
		if (!isVerified)
			return res.status(401).clearCookie('jwt').json({ isVerified: false });

		/** check user */
		const userId = token.id;
		const user = await User.findById(userId);
		if (!user)
			return res.status(404).clearCookie('jwt').json({ isUser: false });

		res.status(200).json({ isUser: true });
	} catch (err) {
		res
			.status(500)
			.json({ error: { message: 'An internal server error has occurred.' } });
	}
};

/* logout user */
module.exports.logout_get = (req, res) => {
	/** clear auth cookie */
	res.status(200).clearCookie('jwt').json({ isCleared: true });
};

/* sign up user and create auth cookie with jwt */
module.exports.signup_post = async (req, res) => {
	const { name, email, password } = req.body;
	const maxAge = 3 * 24 * 60 * 60; // 24hr/s
	try {
		/** create user */
		const user = await User.create({ name, email, password });

		/** create token */
		const payload = { id: user._id },
			token = createToken(payload, process.env.ACCESS_TOKEN_SECRET, maxAge);

		/** create cookie */
		res.cookie(
			'jwt',
			token,
			process.env.NODE_ENV !== 'production'
				? { httpOnly: true, maxAge: maxAge * 1000 }
				: {
						httpOnly: true,
						maxAge: maxAge * 1000,
						sameSite: 'strict',
						secure: true,
				  }
		);

		res.status(201).json({ userCreated: true });
	} catch (err) {
		const errors = handleErrors(err, { name: '', email: '', password: '' });
		if (errors.name || errors.email || errors.password) {
			res.status(400).json({ errors });
		} else {
			res
				.status(500)
				.json({ error: { message: 'An internal server error has occurred.' } });
		}
	}
};

/* log in user and create auth cookie with jwt */
module.exports.login_post = async (req, res) => {
	const { email, password } = req.body;
	const maxAge = 3 * 24 * 60 * 60; // 24hr/s
	try {
		/** get user data with static method 'login' */
		const user = await User.login(email, password);

		/** create token */
		const payload = { id: user._id },
			token = createToken(payload, process.env.ACCESS_TOKEN_SECRET, maxAge);

		/** create cookie */
		res.cookie(
			'jwt',
			token,
			process.env.NODE_ENV !== 'production'
				? { httpOnly: true, maxAge: maxAge * 1000 }
				: {
						httpOnly: true,
						maxAge: maxAge * 1000,
						sameSite: 'strict',
						secure: true,
				  }
		);

		res.status(200).json({ loggedIn: true });
	} catch (err) {
		const errors = handleErrors(err, { user: '' });
		if (errors.user) {
			res.status(400).json({ errors });
		} else {
			res
				.status(500)
				.json({ error: { message: 'An internal server error has occurred.' } });
		}
	}
};
