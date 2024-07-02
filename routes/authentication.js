const router = require('express').Router();

const authController = require('../controllers/authentication');
const middlewares = require('../middlewares/authorization');

router.get('/refresh', middlewares.verifyRefreshToken, authController.refresh);
router.get('/get-account/:id', middlewares.verifyAccessToken, authController.account);
router.get('/logout', middlewares.verifyAccessToken, authController.logout);
router.post('/login', authController.login);
router.post('/register', authController.register);
//router.post('/google-signin', authController.googleSignin);

module.exports = router;