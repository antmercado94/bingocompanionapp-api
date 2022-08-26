const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

/* GET */
router.get('/check_user', authController.check_user);
router.get('/logout', authController.logout_get);

/* POST */
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);

module.exports = router;
