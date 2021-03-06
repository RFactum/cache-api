const Cache = require('../models/cache');

const getCacheByKey = async (key) => {
  const cachedData = await Cache.findOne({ key: key });

  if (!cachedData) {
    throw new Error('Key not found');
  }

  const stillAlive = await handleTimeToLive(cachedData);

  if (!stillAlive) {
    throw new Error('Invalid cache');
  }

  return cachedData;
};

const getAllCachedKeys = async () => {
  const cachedData = await Cache.find().select({ key: 1 });
  return cachedData;
};

const newCacheData = async (key) => {
  if (!key) {
    throw new Error('Invalid key');
  }

  await handleCachedEntriesNumber();
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

/**
 * Get the oldest entry based on updatedAt value and delete this entry to allow new ones to
 * be added to the cache. The updatedAt value was selected to determine which entry to delete
 * because this value is also used to control Time to Live on this API, therefore everytime a
 * cache is get or updated the updatedAt value will also be updated
 */
const handleCachedEntriesNumber = async () => {
  const cachedEntries = await Cache.count();
  if (cachedEntries == process.env.CACHE_ENTRIES_LIMIT) {
    try {
      const olderCache = await Cache.find().sort({ updatedAt: 1 }).limit(1);
      await Cache.remove(olderCache[0]);
    } catch (e) {
      throw new Error(e);
    }
  }
};

const handleTimeToLive = async (cache) => {
  const cacheLastUpdate = new Date(cache.updatedAt).getTime();
  const now = new Date().getTime();

  if (now - cacheLastUpdate > process.env.TIME_TO_LIVE) {
    await Cache.remove(cache);
    return false;
  } else {
    await cache.save();
    return true;
  }
};

const createRandomData = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const insertOrUpdate = async (cache) => {
  try {
    const result = await Cache.findOne({ key: cache.key });

    if (!result) {
      return await insertNewData(cache);
    }

    return await updateCachedData(result, cache.data);
  } catch (e) {
    throw new Error(e);
  }
};

const updateCachedData = async (cache, newData) => {
  cache.data = newData;
  try {
    await cache.save();
    return false;
  } catch (e) {
    throw new Error(e);
  }
};

const insertNewData = async (cache) => {
  try {
    await handleCachedEntriesNumber();
    await new Cache({ key: cache.key, data: cache.data }).save();
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

const deleteAll = async () => {
  try {
    await Cache.deleteMany();
  } catch (e) {
    throw new Error(e);
  }
};

const deleteByKey = async (cache) => {
  try {
    const cacheDeleted = await Cache.remove({ key: cache });
    if (cacheDeleted.deletedCount === 0) {
      return false;
    }
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getCacheByKey,
  newCacheData,
  getAllCachedKeys,
  insertOrUpdate,
  deleteAll,
  deleteByKey,
};
