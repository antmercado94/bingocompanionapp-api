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

	while (i <= 25) {
		let column = '';

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

		/** populate array */
		cells = [
			...cells,
			{
				column,
				value: i === 13 ? 'free' : _.random(1, 20), // 1-20
				match: false,
			},
		];
		i++;
	}

	res.json({ cells });
};

/* return 5 arrays with numbers 1-20 */
module.exports.get_numbers = (req, res) => {
	let columnsSet = [[], [], [], [], []],
		numberSet = [
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
		];

	/** populate each array with numbers 1-20 */
	let i = 1;
	while (i <= numberSet.length) {
		columnsSet[0].push(i);
		columnsSet[1].push(i);
		columnsSet[2].push(i);
		columnsSet[3].push(i);
		columnsSet[4].push(i);
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
