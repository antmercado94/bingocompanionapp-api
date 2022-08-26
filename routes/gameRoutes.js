const { Router } = require('express');
const gameController = require('../controllers/gameController');

const router = Router();

/* GET */
router.get('/cells', gameController.get_cells);
router.get('/numbers', gameController.get_numbers);

/* POST */
router.post('/save', gameController.save_game);

/* PUT */
router.put('/complete', gameController.update_complete);

module.exports = router;
