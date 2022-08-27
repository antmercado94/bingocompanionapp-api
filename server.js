const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectToDb } = require('./db/db');
const gameRoutes = require('./routes/gameRoutes'),
	authRoutes = require('./routes/authRoutes'),
	generateRoutes = require('./routes/generateRoutes'),
	userRoutes = require('./routes/userRoutes');

// dev env
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// init
const app = express();

// port
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use(gameRoutes);
app.use(authRoutes);
app.use(generateRoutes);
app.use(userRoutes);

// db connection
connectToDb((err) => {
	if (!err) {
		app.listen(port, () => {
			console.log(`listing on port ${port}`);
		});
	}
});
