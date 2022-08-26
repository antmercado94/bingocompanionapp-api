/**
 * PDF generator related functions
 */

const { bingoPDF } = require('../helpers/bingoPDF');

/* send link to PDF generator api as response */
module.exports.generate_cards = async (req, res) => {
	const { quantity } = req.body;
	const maxQuantity = 50;
	try {
		if (!quantity || isNaN(quantity) || quantity > maxQuantity)
			return res.status(400).json({
				errors: { generate: 'Please enter a valid number from 1-50' },
			});

		const host = req.headers.host;
		const link = `http://${host}/api/generated/${quantity}`; // api url proxy

		res.status(200).json({ url: link });
	} catch (err) {
		res
			.status(500)
			.json({ errors: { message: 'An internal server error has occurred.' } });
	}
};

/* get generated PDF */
module.exports.generated_pdf = async (req, res) => {
	const { quantity } = req.params;
	const maxQuantity = 50;
	try {
		if (!quantity || isNaN(quantity) || quantity > maxQuantity)
			return res.status(400).json({
				errors: { generate: 'Please enter a valid number from 1-50' },
			});

		const stream = res.writeHead(200, {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `inline`,
		});
		bingoPDF(
			(chunk) => stream.write(chunk),
			() => stream.end(),
			quantity
		);
	} catch (err) {
		res
			.status(500)
			.json({ errors: { message: 'An internal server error has occurred.' } });
	}
};
