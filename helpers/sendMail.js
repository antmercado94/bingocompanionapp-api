/**
 * Send mail using SendGrid
 */

const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const Email = require('email-templates');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const { ADMIN_EMAIL } = process.env;

const sendMail = async (to, url) => {
	try {
		const transporter = nodemailer.createTransport(
			nodemailerSendgrid({
				apiKey: process.env.SENDGRID_API_KEY,
			})
		);

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
		console.log(err.message);
		return { error: err.message };
	}
};

module.exports = { sendMail };
