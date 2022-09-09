/**
 * Generate PDF Bingo Cards
 */

const PdfPrinter = require('pdfmake');
const htmlToPdfMake = require('html-to-pdfmake');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM('');
const pdfTemplate = require('./pdfTemplate');

const bingoPDF = (dataCallback, endCallback, quantity) => {
	const lineColor = '#252121';
	const lineWidth = 7;
	const fonts = {
		Rubik: {
			normal: 'fonts/Rubik-Regular.ttf',
			bold: 'fonts/Rubik-Bold.ttf',
		},
	};

	/* canvas rounded border */
	const canvas = {
		canvas: [
			{
				type: 'rect',
				x: 40,
				y: 152,
				w: 532,
				h: 578,
				r: 10,
				lineColor,
				lineWidth,
			},
		],
		absolutePosition: { x: 0, y: 0 },
	};

	const docDefinition = {
		content: [],
		info: {
			title: 'Generated Bingo Cards',
		},
		defaultStyle: {
			font: 'Rubik',
		},
		images: null,
		pageSize: 'LETTER',
		pageOrientation: 'portrait',
		pageMargins: [40, 45, 40, 45],
	};

	/* loop quantity */
	let PDFs = [];
	let i = 0;
	while (i <= quantity - 1) {
		PDFs[i] = htmlToPdfMake(pdfTemplate(), {
			tableAutoSize: true,
			imagesByReference: true,
			window: window,
		});
		/** add images to dd */
		if (i === 0) docDefinition.images = PDFs[i].images;
		i++;
	}

	/* push PDF with canvas (per page) */
	PDFs.forEach((PDF) => {
		docDefinition.content.push(PDF.content, canvas);
	});

	const printer = new PdfPrinter(fonts);

	/* table options */
	const myTableLayouts = {
		gridLayout: {
			hLineColor: lineColor,
			vLineColor: lineColor,
			hLineWidth: () => {
				return lineWidth;
			},
			vLineWidth: () => {
				return lineWidth;
			},
		},
	};

	const options = {
		bufferPages: true,
		tableLayouts: myTableLayouts,
	};

	const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
	pdfDoc.on('data', dataCallback);
	pdfDoc.on('end', endCallback);
	pdfDoc.end();
};

module.exports = { bingoPDF };
