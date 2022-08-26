const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

/* GET */
router.get('/get_user', userController.get_user);
router.get('/resetpw/:id/:token', userController.resetpw);

/* POST */
router.post('/resetpw_post', userController.resetpw_post);
router.post('/pw_reset/:id/:token', userController.pw_reset);

/* PUT */
router.put('/update-user', userController.update_user);

/* DELETE */
router.delete('/erase_records', userController.delete_records);
router.delete('/delete_user', userController.delete_user);

module.exports = router;
