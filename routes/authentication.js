const router = require('express').Router();

const authController = require('../controllers/authentication');

router.get('/get-account', authController.account);
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;