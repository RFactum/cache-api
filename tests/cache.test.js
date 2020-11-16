const app = require('../src/app');
const {
  getCacheByKey,
  getAllCachedKeys,
  newCacheData,
} = require('../src/services/cache');
const { setupDatabase, cacheOne, cacheTwo } = require('./fixtures/db');
const Cache = require('../src/models/cache');

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

      const cacheThree = await Cache.findOne({ key: 'cache3' });
      expect({ key: result.key, data: result.data }).toEqual({
        key: cacheThree.key,
        data: cacheThree.data,
      });
    });

    test('Should throw an error of invalid key', async () => {
      expect(newCacheData()).rejects.toEqual(new Error('Invalid key'));
    });
  });
});
