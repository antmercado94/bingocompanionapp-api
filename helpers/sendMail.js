/**
 * Send mail using Nodemailer
 */

const nodemailer = require('nodemailer');
const Email = require('email-templates');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const { ADMIN_EMAIL, ADMIN_APP_PW } = process.env;

const sendMail = async (to, url) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'Gmail',
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: ADMIN_EMAIL,
				pass: ADMIN_APP_PW,
			},
		});

		const email = new Email({
			message: {
				from: `Bingo Companion App <${ADMIN_EMAIL}>`,
			},
			send: true,
			transport: transporter,
			views: {
				options: {
					extension: 'ejs',
				},
			},
		});

		/** send email */
		const result = await email.send({
			template: 'reset',
			message: {
				to,
			},
			locals: {
				resetUrl: url,
				homeUrl: process.env.HOME_URL,
				logo: process.env.LOGO_PATH,
			},
		});

		return result;
	} catch (err) {
		return { error: err.message };
	}
};

module.exports = { sendMail };
