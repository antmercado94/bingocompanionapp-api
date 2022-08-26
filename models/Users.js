/**
 * User schema
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter a name.'],
	},
	email: {
		type: String,
		required: [true, 'Please enter an email.'],
		unique: true,
		lowercase: true,
		validate: [isEmail, 'Please enter a valid email.'],
	},
	password: {
		type: String,
		required: [true, 'Please enter a password.'],
		minlength: [6, 'Minimum password length is 6 characters.'],
	},
	completedGames: {
		type: Number,
		default: 0,
	},
	savedGames: {
		type: Number,
		default: 0,
	},
	lastCompletedGame: {
		type: Date,
		default: null,
	},
});

/* salt pw with bcrypt before save */
userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);

	next();
});

/* salt pw with bcrypt before update */
userSchema.pre('findOneAndUpdate', async function (next) {
	let update = this.getUpdate();

	if (update.$set.password) {
		/** return minlength validation */
		if (update.$set.password.length < 6) return update;

		const salt = await bcrypt.genSalt();
		update.$set.password = await bcrypt.hash(
			this.getUpdate().$set.password,
			salt
		);
	}

	next();
});

/* compare input pw with user's hashed pw, return user doc */
userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });
	if (!user) throw Error('incorrect email');

	const auth = await bcrypt.compare(password, user.password); // bool
	if (!auth) throw Error('incorrect password');

	return user;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
