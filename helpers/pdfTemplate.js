/**
 * Return bingo card template used for PDF generation
 */

const _ = require('lodash');
const path = require('path');

module.exports = () => {
	const logoSrc = path.join(__dirname, '../assets/', 'bingo-logo.png');

	return `<div>
						<img src=${logoSrc} alt="" style="width:150px;text-align:center"</img>
					</div>
					<table data-pdfmake="{&quot;layout&quot;:&quot;gridLayout&quot;}" style="width:100%;">
						<tr style="text-align:center;font-size:80px;color:#ffffff;">
							<th scope="col" style="background-color:#0661EB;">B</th>
							<th scope="col" style="background-color:#977AB2;">I</th>
							<th scope="col" style="background-color:#9399C9;">N</th>
							<th scope="col" style="background-color:#8BA949;">G</th>
							<th scope="col" style="background-color:#AA5E2A;">O</th>
						</tr>
						<tr style=text-align:center;margin:20px;font-size:65px;color:#252121;>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
						</tr>
						<tr style=text-align:center;margin:20px;font-size:65px;color:#252121;>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
						</tr>
						<tr style=text-align:center;font-size:65px;color:#252121;>
							<td style=margin:20px;>${_.random(1, 20)}</td>
							<td style=margin:20px;>${_.random(1, 20)}</td>
							<td style="margin-top:30px"><img src=${logoSrc} alt="" style=width:120px;opacity:0.5;</img></td>
							<td style=margin:20px;>${_.random(1, 20)}</td>
							<td style=margin:20px;>${_.random(1, 20)}</td>
						</tr>
						<tr style=text-align:center;margin:20px;font-size:65px;color:#252121;>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
						</tr>
						<tr style=text-align:center;margin:20px;font-size:65px;color:#252121;>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
							<td>${_.random(1, 20)}</td>
						</tr>
					</table>`;
};
