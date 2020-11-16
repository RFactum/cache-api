const express = require('express');
const cacheController = require('../controllers/cacheController');

const router = express.Router();

router.get('/', cacheController.getCachedData);

module.exports = router;
