const cacheService = require('../services/cache');

const getCachedData = async (req, res) => {
  try {
    const cachedData = await cacheService.getCacheByKey(req.params.key);
    console.log('Cache hit');
    return res.send(cachedData.data);
  } catch (e) {
    if (e.message === 'Key not found' || e.message === 'Invalid cache') {
      console.log('Cache miss');
      try {
        const cachedData = await cacheService.newCacheData(req.params.key);
        return res.status(201).send(cachedData.data);
      } catch (e) {
        return res.status(500).send();
      }
    }
    return res.status(500).send();
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

const insertUpdateData = async (req, res) => {
  try {
    const newData = await cacheService.insertOrUpdate(req.body);
    if (newData) {
      return res.status(201).send();
    } else {
      return res.send();
    }
  } catch (e) {
    return res.status(500).send();
  }
};

const deleteAllCaches = async (req, res) => {};

const deleteByKey = async (req, res) => {};

module.exports = {
  getCachedData,
  getCachedKeys,
  insertUpdateData,
  deleteAllCaches,
  deleteByKey,
};
