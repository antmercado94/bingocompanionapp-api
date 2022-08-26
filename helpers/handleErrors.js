/**
 * Handle user error messaging
 */

const handleErrors = (err, errProps) => {
	let errors = errProps; // obj

	/** log in validation: email or password */
	if (
		err.message === 'incorrect email' ||
		err.message === 'incorrect password'
	) {
		errors.user = 'Incorrect email or password.';
	}

	/** sign up validation: duplicate email ('unique' error handler)  */
	if (err.code === 11000) {
		errors.email = 'that email is already registered';
		return errors;
	}

	/** required, minlength error handlers */
	if (
		err.message.includes('user validation failed:') ||
		err.message.includes('Validation failed:') ||
		err.message.includes('record validation failed:')
	) {
		/** cycle errors, populate matching error path with message */
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

module.exports = { handleErrors };
