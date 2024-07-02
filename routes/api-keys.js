const router = require('express').Router();
const apiController = require('../controllers/api-keys');

router.get('/:user_id/api-keys', apiController.getKeys);
router.get('/:user_id/new-key', apiController.generateApiKey);
router.delete('/:user_id/api-keys/:token_id', apiController.revokeApiKey);

module.exports = router;