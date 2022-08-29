/**
 * Return bingo card template used for PDF generation
 */

const _ = require('lodash');
const path = require('path');

module.exports = () => {
	const logoSrc = path.join(__dirname, '../assets/', 'bingo-logo.png');

	/** Define column ranges (75-Ball) */
	let range0 = [],
		range1 = [],
		range2 = [],
		range3 = [],
		range4 = [];

	for (let i = 1; i <= 75; i++) {
		if (i <= 15) range0.push(i);
		if (i > 15 && i <= 30) range1.push(i);
		if (i > 30 && i <= 45) range2.push(i);
		if (i > 45 && i <= 60) range3.push(i);
		if (i > 60 && i <= 75) range4.push(i);
	}

	const getRangeCellVal = (range) => {
		let rangeVal = range[Math.floor(Math.random() * range.length)];
		/** remove from array */
		for (let i = 0; i < range.length; i++) {
			if (range[i] === rangeVal) {
				range.splice(i, 1);
			}
		}
		return rangeVal;
	};

	return `<div>
						<img src=${logoSrc} alt="" style="margin-top:10px;width:150px;text-align:center"</img>
					</div>
					<table data-pdfmake="{&quot;layout&quot;:&quot;gridLayout&quot;}" style="width:100%;">
						<tr style="text-align:center;font-size:80px;color:#ffffff;">
							<th scope="col" style="background-color:#0661EB;">B</th>
							<th scope="col" style="background-color:#977AB2;">I</th>
							<th scope="col" style="background-color:#9399C9;">N</th>
							<th scope="col" style="background-color:#8BA949;">G</th>
							<th scope="col" style="background-color:#AA5E2A;">O</th>
						</tr>
						<tr style=text-align:center;margin:18px;font-size:65px;color:#252121;>
							<td>${getRangeCellVal(range0)}</td>
							<td>${getRangeCellVal(range1)}</td>
							<td>${getRangeCellVal(range2)}</td>
							<td>${getRangeCellVal(range3)}</td>
							<td>${getRangeCellVal(range4)}</td>
						</tr>
						<tr style=text-align:center;margin:18px;font-size:65px;color:#252121;>
							<td>${getRangeCellVal(range0)}</td>
							<td>${getRangeCellVal(range1)}</td>
							<td>${getRangeCellVal(range2)}</td>
							<td>${getRangeCellVal(range3)}</td>
							<td>${getRangeCellVal(range4)}</td>
						</tr>
						<tr style=text-align:center;font-size:65px;color:#252121;>
							<td style=margin:18px;>${getRangeCellVal(range0)}</td>
							<td style=margin:18px;>${getRangeCellVal(range1)}</td>
							<td style=margin-top:28px;><img src=${logoSrc} alt="" style=width:120px;opacity:0.5;</img></td>
							<td style=margin:18px;>${getRangeCellVal(range3)}</td>
							<td style=margin:18px;>${getRangeCellVal(range4)}</td>
						</tr>
						<tr style=text-align:center;margin:18px;font-size:65px;color:#252121;>
							<td>${getRangeCellVal(range0)}</td>
							<td>${getRangeCellVal(range1)}</td>
							<td>${getRangeCellVal(range2)}</td>
							<td>${getRangeCellVal(range3)}</td>
							<td>${getRangeCellVal(range4)}</td>
						</tr>
						<tr style=text-align:center;margin:18px;font-size:65px;color:#252121;>
							<td>${getRangeCellVal(range0)}</td>
							<td>${getRangeCellVal(range1)}</td>
							<td>${getRangeCellVal(range2)}</td>
							<td>${getRangeCellVal(range3)}</td>
							<td>${getRangeCellVal(range4)}</td>
						</tr>
					</table>`;
};
