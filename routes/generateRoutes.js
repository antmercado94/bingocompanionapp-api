const { Router } = require('express');
const generateController = require('../controllers/generateController');

const router = Router();

/* POST */
router.post('/generate', generateController.generate_cards);

/* GET */
router.get('/generated/:quantity', generateController.generated_pdf);

module.exports = router;
