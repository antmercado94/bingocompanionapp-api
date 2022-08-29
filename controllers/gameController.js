/**
 * Game related functions
 */

const _ = require('lodash');
const User = require('../models/Users');
const Record = require('../models/Records');
const { verifyToken } = require('../util/jwt');
const { handleErrors } = require('../helpers/handleErrors');

/* return array of cells */
module.exports.get_cells = (req, res) => {
	let cells = [],
		i = 1;

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

	while (i <= 25) {
		let column = '',
			rangeVal;

		/** five bingo columns: 5x5 grid layout */
		const columnB = [1, 6, 11, 16, 21],
			columnI = [2, 7, 12, 17, 22],
			columnN = [3, 8, 13, 18, 23],
			columnG = [4, 9, 14, 19, 24],
			columnO = [5, 10, 15, 20, 25];

		/** match columns of a bingo grid */
		if (columnB.includes(i)) {
			column = 0; // B
		} else if (columnI.includes(i)) {
			column = 1; // I
		} else if (columnN.includes(i)) {
			column = 2; // N
		} else if (columnG.includes(i)) {
			column = 3; // G
		} else if (columnO.includes(i)) {
			column = 4; // O
		}

		/** Column cell value */
		switch (column) {
			case 0: // B
				rangeVal = range0[Math.floor(Math.random() * range0.length)];
				/** remove from array */
				for (let i = 0; i < range0.length; i++) {
					if (range0[i] === rangeVal) {
						range0.splice(i, 1);
					}
				}
				break;
			case 1: // I
				rangeVal = range1[Math.floor(Math.random() * range1.length)];
				/** remove from array */
				for (let i = 0; i < range1.length; i++) {
					if (range1[i] === rangeVal) {
						range1.splice(i, 1);
					}
				}
				break;
			case 2: // N
				rangeVal = range2[Math.floor(Math.random() * range2.length)];
				/** remove from array */
				for (let i = 0; i < range2.length; i++) {
					if (range2[i] === rangeVal) {
						range2.splice(i, 1);
					}
				}
				break;
			case 3: // G
				rangeVal = range3[Math.floor(Math.random() * range3.length)];
				/** remove from array */
				for (let i = 0; i < range3.length; i++) {
					if (range3[i] === rangeVal) {
						range3.splice(i, 1);
					}
				}
				break;
			case 4: // O
				rangeVal = range4[Math.floor(Math.random() * range4.length)];
				/** remove from array */
				for (let i = 0; i < range4.length; i++) {
					if (range4[i] === rangeVal) {
						range4.splice(i, 1);
					}
				}
				break;
			default:
				break;
		}

		/** populate array */
		cells = [
			...cells,
			{
				column,
				value: i === 13 ? 'free' : rangeVal,
				match: false,
			},
		];
		i++;
	}

	res.json({ cells });
};

/* return 5 arrays containing callable numbers */
module.exports.get_numbers = (req, res) => {
	let columnsSet = [[], [], [], [], []],
		numberSet = [];

	for (let i = 1; i <= 75; i++) {
		numberSet.push(i);
	}

	/** populate each array in accordance with 75-Ball Bingo column ranges */
	let i = 1;
	while (i <= numberSet.length) {
		if (i <= 15) columnsSet[0].push(i);
		if (i > 15 && i <= 30) columnsSet[1].push(i);
		if (i > 30 && i <= 45) columnsSet[2].push(i);
		if (i > 45 && i <= 60) columnsSet[3].push(i);
		if (i > 60 && i <= 75) columnsSet[4].push(i);
		i++;
	}

	res.json({ numbers: columnsSet });
};

/* save game result as a record */
module.exports.save_game = async (req, res) => {
	const reqToken = req.cookies.jwt;
	const { winner, calledNumbers, withGrid } = req.body;
	try {
		/** check token */
		const { isVerified, token } = verifyToken(
			reqToken,
			process.env.ACCESS_TOKEN_SECRET
		);
		if (!reqToken || !isVerified)
			return res.status(401).json({ isVerified: false });

		/** check user */
		const userId = token.id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ isUser: false });

		/** create 'record' doc */
		await Record.create({
			dateSaved: Date.now(),
			winner,
			calledNumbers,
			withGrid,
			userId,
		});

		/** update completed games count */
		await User.findOneAndUpdate(
			{ _id: userId },
			{ $set: { savedGames: user.savedGames + 1 } }
		);

		res.status(200).json({ saved: true });
	} catch (err) {
		const errors = handleErrors(err, { winner: '' });
		if (errors.winner) {
			res.status(400).json({ errors });
		} else {
			res.status(500).json({
				errors: { message: 'An internal server error has occurred.' },
			});
		}
	}
};

/* update user's 'completedGames' count */
module.exports.update_complete = async (req, res) => {
	const reqToken = req.cookies.jwt;

	/** check token */
	const { isVerified, token } = verifyToken(
		reqToken,
		process.env.ACCESS_TOKEN_SECRET
	);
	if (!reqToken || !isVerified)
		return res.status(401).json({ isVerified: false });

	/** check user */
	const userId = token.id;
	const user = await User.findById(userId);
	if (!user) return res.status(404).json({ isUser: false });

	/** update user's completedGames by 1 */
	await User.findOneAndUpdate(
		{ _id: userId },
		{
			$set: {
				completedGames: user.completedGames + 1,
				lastCompletedGame: Date.now(),
			},
		}
	);

	res.status(200).json({ updated: true });
};
