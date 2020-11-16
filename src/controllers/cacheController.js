const cacheService = require('../services/cache');

const getCachedData = async (req, res) => {
  try {
    const cachedData = await cacheService.getCacheByKey(req.params.key);
    console.log('Cache hit');
    res.send(cachedData.data);
  } catch (e) {
    console.log('Cache miss');
    const cachedData = await cacheService.newCacheData(req.params.key);
    res.status(201).send(cachedData.data);
  }
};

const getCachedKeys = async (req, res) => {
  try {
    const cachedData = await cacheService.getAllCachedKeys();
    res.send(cachedData);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getCachedData,
  getCachedKeys,
};
