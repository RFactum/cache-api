const express = require('express');
const cacheController = require('../controllers/cacheController');

const router = express.Router();

router.get('/caches', cacheController.getCachedKeys);
router.get('/cache/:key', cacheController.getCachedData);
router.post('/cache', cacheController.insertUpdateData);
router.delete('/caches', cacheController.deleteAllCaches);
router.delete('/cache/:key', cacheController.deleteByKey);

module.exports = router;
