/**
 * User related functions
 */

const bcrypt = require('bcrypt');
const User = require('../models/Users');
const Record = require('../models/Records');
const { verifyToken, createToken } = require('../util/jwt');
const { sendMail } = require('../helpers/sendMail');
const { handleErrors } = require('../helpers/handleErrors');

/* return user data */
module.exports.get_user = async (req, res) => {
	const reqToken = req.cookies.jwt;
	try {
		/** check cookie */
		if (!reqToken) return res.status(404).json({ isUser: false });

		/** check token */
		const { isVerified, token } = verifyToken(
			reqToken,
			process.env.ACCESS_TOKEN_SECRET
		);
		if (!isVerified) return res.status(401).json({ isVerified: false });

		/** check user */
		const userId = token.id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ isUser: false });

		const records = await Record.find({ userId });
		const userData = {
			name: user.name,
			email: user.email,
			completedGames: user.completedGames,
			lastCompletedGame: user.lastCompletedGame,
			savedGames: user.savedGames,
			games: records,
		};

		res.status(200).json({ userData });
	} catch (err) {
		res
			.status(500)
			.json({ errors: { message: 'An internal server error has occurred.' } });
	}
};

/* update user's name or email */
module.exports.update_user = async (req, res) => {
	const reqToken = req.cookies.jwt;
	const { newName, newEmail } = req.body;
	try {
		/** check cookie */
		if (!reqToken)
			return res.status(404).json({
				errors: { message: 'An error has occurred: could not update data.' },
			});

		/** check token */
		const { isVerified, token } = verifyToken(
			reqToken,
			process.env.ACCESS_TOKEN_SECRET
		);
		if (!isVerified)
			return res.status(401).json({
				errors: { message: 'An error has occurred: could not update data.' },
			});

		/** check user */
		const userId = token.id;
		const user = await User.findById(userId);
		if (!user)
			return res.status(404).json({
				errors: { message: 'An error has occurred: could not update data.' },
			});

		/** update name */
		if (newName) {
			await User.findOneAndUpdate({ _id: userId }, { $set: { name: newName } });
			return res.status(200).json({ nameUpdated: true });
		}
		/** update email */
		if (newEmail) {
			await User.findOneAndUpdate(
				{ _id: userId },
				{ $set: { email: newEmail } },
				{ runValidators: true }
			);
			return res.status(200).json({ emailUpdated: true });
		}
	} catch (err) {
		const errors = handleErrors(err, { email: '' });
		if (errors.email) {
			res.status(400).json({ errors });
		} else {
			res.status(500).json({
				errors: { message: 'An internal server error has occurred.' },
			});
		}
	}
};

/* send email reset link */
module.exports.resetpw_post = async (req, res) => {
	const { email } = req.body;
	try {
		/** check email */
		const user = await User.findOne({ email });
		if (!user)
			return res
				.status(404)
				.json({ errors: { email: 'Email could not be found.' } });

		/** create unique secret with user's pw */
		const secret = process.env.RESET_TOKEN_SECRET + user.password; // Note: secret made with crypto.randomBytes(32).toString("hex")

		/** create token */
		const payload = { id: user._id, email: user.email },
			token = createToken(payload, secret, '1m');

		/** send reset email */
		const host = req.headers.host;
		const link = `http://${host}/resetpw/${user.id}/${token}`;
		const result = await sendMail(user.email, link);
		if (result.error)
			return res
				.status(500)
				.json({ errors: { email: 'There was a problem sending an Email.' } });

		res.status(200).json({ emailSent: true });
	} catch (err) {
		res
			.status(500)
			.json({ errors: { message: 'An internal server error has occurred.' } });
	}
};

/* reset password GET req */
module.exports.resetpw = async (req, res) => {
	const { id, token } = req.params;
	try {
		/** check user */
		const user = await User.findById(id);
		if (!user) return res.status(404).json({ isUser: false });

		/** check token */
		const secret = process.env.RESET_TOKEN_SECRET + user.password;
		const { isVerified } = verifyToken(token, secret);
		if (!isVerified) return res.status(401).json({ isVerified: false });

		res.status(200).json({ isVerified: true });
	} catch (err) {
		res
			.status(500)
			.json({ errors: { message: 'An internal server error has occurred.' } });
	}
};

/* reset password POST req */
module.exports.pw_reset = async (req, res) => {
	const { id, token } = req.params;
	const { password, repeatPassword } = req.body;
	try {
		/** check user */
		const user = await User.findById(id);
		if (!user) return res.status(404).json({ isUser: false });

		/** check token */
		const secret = process.env.RESET_TOKEN_SECRET + user.password;
		const { isVerified } = verifyToken(token, secret);
		if (!isVerified) return res.status(401).json({ isVerified: false });

		/** check plain text passwords */
		if (password !== repeatPassword)
			return res
				.status(422)
				.json({ errors: { password: 'password must match!' } });

		/** check for previous password match */
		const previousPwMatch = await bcrypt.compare(password, user.password);
		if (previousPwMatch)
			return res.status(422).json({
				errors: {
					password:
						'your new password cannot be the same as your current password.',
				},
			});

		await User.findOneAndUpdate(
			{ _id: user._id },
			{ $set: { password } },
			{ runValidators: true }
		);

		res.status(200).json({ pwUpdated: true });
	} catch (err) {
		const errors = handleErrors(err, { password: '' });
		if (errors.password) {
			res.status(400).json({ errors });
		} else {
			res.status(500).json({
				errors: { message: 'An internal server error has occurred.' },
			});
		}
	}
};

/* delete all user records */
module.exports.delete_records = async (req, res) => {
	const reqToken = req.cookies.jwt;
	try {
		/** check cookie */
		if (!reqToken)
			return res.status(404).json({
				errors: { message: 'An error has occurred: could not remove data.' },
			});

		/** check token */
		const { isVerified, token } = verifyToken(
			reqToken,
			process.env.ACCESS_TOKEN_SECRET
		);
		if (!isVerified)
			return res.status(401).json({
				errors: { message: 'An error has occurred: could not remove data.' },
			});

		/** check user */
		const userId = token.id;
		const user = await User.findById(userId);
		if (!user)
			return res.status(404).json({
				errors: { message: 'An error has occurred: could not remove data.' },
			});

		/** remove records */
		const records = await Record.deleteMany({ userId: user._id });
		if (records.deletedCount === 0)
			return res.status(200).json({
				errors: { message: 'There are currently no available records.' },
			});

		/** reset saved games count */
		await User.findOneAndUpdate({ _id: userId }, { $set: { savedGames: 0 } });

		res.status(200).json({ recordsErased: true });
	} catch (err) {
		res
			.status(500)
			.json({ errors: { message: 'An internal server error has occurred.' } });
	}
};

/* delete all user data */
module.exports.delete_user = async (req, res) => {
	const reqToken = req.cookies.jwt;
	try {
		/** check cookie */
		if (!reqToken)
			return res.status(404).json({
				errors: { message: 'An error has occurred: could not delete user.' },
			});

		/** check token */
		const { isVerified, token } = verifyToken(
			reqToken,
			process.env.ACCESS_TOKEN_SECRET
		);
		if (!isVerified)
			return res.status(401).json({
				errors: { message: 'An error has occurred: could not delete user.' },
			});

		/** check user */
		const userId = token.id;
		const user = await User.findById(userId);
		if (!user)
			return res.status(404).json({
				errors: { message: 'An error has occurred: could not delete user.' },
			});

		/** delete user records */
		await Record.deleteMany({ userId: user._id });

		/** delete user */
		const { deletedCount } = await User.deleteOne({ _id: user._id });
		if (deletedCount !== 1) throw Error({ userDeleted: false });

		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.header('Expires', '-1');
		res.header('Pragma', 'no-cache');
		res.status(200).clearCookie('jwt').json({ userDeleted: true });
	} catch (err) {
		res
			.status(500)
			.json({ errors: { message: 'An internal server error has occurred.' } });
	}
};
