const app = require('../src/app');
const {
  getCacheByKey,
  getAllCachedKeys,
  newCacheData,
  insertOrUpdate,
  deleteAll,
  deleteByKey,
} = require('../src/services/cache');
const {
  setupDatabase,
  cacheOne,
  cacheTwo,
  cacheThree,
} = require('./fixtures/db');
const Cache = require('../src/models/cache');
const cache = require('../src/services/cache');

describe('Cache Service', () => {
  beforeEach(setupDatabase);

  describe('getCacheByData', () => {
    test('Should return correct cached data', async () => {
      const result = await getCacheByKey(cacheOne.key);
      expect(result.data).toEqual(cacheOne.data);
    });

    test('Should throw an error of key not found', async () => {
      expect(getCacheByKey('1')).rejects.toEqual(new Error('Key not found'));
    });

    test('Should throw an error of key not found', async () => {
      expect(getCacheByKey()).rejects.toEqual(new Error('Key not found'));
    });

    test('Should throw an error invalid cache', async (done) => {
      setTimeout(() => {
        expect(getCacheByKey(cacheTwo.key)).rejects.toEqual(
          new Error('Invalid cache')
        );
        done();
      }, 1000);
    });
  });

  describe('getAllCachedKeys', () => {
    test('Should return 2 keys - cache1 and cache2', async () => {
      const result = await getAllCachedKeys();
      expect(result.length).toBe(2);
      expect(result[0].key).toEqual(cacheOne.key);
      expect(result[1].key).toEqual(cacheTwo.key);
    });
  });

  describe('newCacheData', () => {
    test('Should return the new data and key added to the cache', async () => {
      const result = await newCacheData('cache3');

      const newCache = await Cache.findOne({ key: 'cache3' });
      expect({ key: result.key, data: result.data }).toEqual({
        key: newCache.key,
        data: newCache.data,
      });
    });

    test('Should throw an error of invalid key', async () => {
      expect(newCacheData()).rejects.toEqual(new Error('Invalid key'));
    });
  });

  describe('insertOrUpdate', () => {
    test('Should add new cache to the DB', async () => {
      await insertOrUpdate(cacheThree);
      const addedCache = await Cache.findOne({ key: cacheThree.key });
      expect(addedCache).not.toBeNull();
    });

    test('Should update the cache data of cacheOne', async () => {
      await insertOrUpdate({
        key: cacheOne.key,
        data: 'new Data',
      });
      const updatedCache = await Cache.findOne({ key: cacheOne.key });
      expect(updatedCache.data).toEqual('new Data');
    });

    test('Should throw an error', async () => {
      expect(insertOrUpdate()).rejects.toThrow();
    });
  });

  describe('deleteAll', () => {
    test('Should delete all cached data', async () => {
      await deleteAll();
      const result = await Cache.count();
      expect(result).toBe(0);
    });
  });

  describe('deleteByKey', () => {
    test('Should delete cacheOne and return true', async () => {
      const result = await deleteByKey(cacheOne.key);
      expect(result).toBe(true);

      const deletedCache = await Cache.findOne({ key: cacheOne.key });
      expect(deletedCache).toBeNull();
    });

    test('Should return false', async () => {
      const result = await deleteByKey('notKey');
      expect(result).toBe(false);
    });

    test('Should return false', async () => {
      const result = await deleteByKey();
      expect(result).toBe(false);
    });
  });
});
