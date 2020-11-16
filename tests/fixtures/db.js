const { Mongoose } = require('mongoose');
const Cache = require('../../src/models/cache');

const cacheOne = {
  key: 'cache1',
  data: 'cache one data',
};

const cacheTwo = {
  key: 'cache2',
  data: 'cache two data',
};

const setupDatabase = async () => {
  await Cache.deleteMany();
  await new Cache(cacheOne).save();
  await new Cache(cacheTwo).save();
};

module.exports = {
  setupDatabase,
  cacheOne,
  cacheTwo,
};
