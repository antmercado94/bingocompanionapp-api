/**
 * Record schema
 */

const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
	dateSaved: {
		type: Date,
	},
	winner: {
		type: String,
		required: [true, 'Please enter a name'],
	},
	calledNumbers: {
		type: Array,
	},
	withGrid: {
		type: Boolean,
	},
	userId: {
		type: mongoose.ObjectId,
	},
});

const Record = mongoose.model('record', recordSchema);

module.exports = Record;
