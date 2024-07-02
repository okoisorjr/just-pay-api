const router = require('express').Router();

const flwPaymentController = require('../controllers/flw-payments');

router.post('/card', flwPaymentController.flw_charge_card);
router.post('/card_pin', flwPaymentController.flw_recall_charge);
router.post('/validate_otp', flwPaymentController.flw_validate_otp);
module.exports = router;