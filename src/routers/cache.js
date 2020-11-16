const express = require('express');
const cacheController = require('../controllers/cacheController');

const router = express.Router();

router.get('/cache/keys', cacheController.getCachedKeys);
router.get('/cache/:key', cacheController.getCachedData);

module.exports = router;
