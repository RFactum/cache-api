const Cache = require('../models/cache');

const getCacheByKey = async (key) => {
  const cachedData = await Cache.findOne({ key: key });

  if (!cachedData) {
    throw new Error('Key not found');
  }

  return cachedData;
};

const getAllCachedKeys = async () => {
  const cachedData = await Cache.find().select({ key: 1 });
  return cachedData;
};

const newCacheData = async (key) => {
  const data = createRandomData();
  const cachedData = {
    key,
    data,
  };
  try {
    await new Cache(cachedData).save();
    return cachedData;
  } catch (e) {
    throw new Error(e);
  }
};

const createRandomData = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

module.exports = {
  getCacheByKey,
  newCacheData,
  getAllCachedKeys,
};
