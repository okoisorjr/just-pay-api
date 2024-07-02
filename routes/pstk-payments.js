const router = require('express').Router();

const pstkPaymentController = require('../controllers/pstk-payments');

router.post('/card', pstkPaymentController.pstk_charge_card);
/* router.post('/card_pin', pstkPaymentController.pstk_recall_charge);
router.post('/validate_otp', pstkPaymentController.pstk_validate_otp); */

module.exports = router;