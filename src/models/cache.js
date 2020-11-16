const mongoose = require('mongoose');

const cacheSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

cacheSchema.methods.toJSON = function () {
  const cacheObject = this.toObject();

  delete cacheObject._id;
  delete cacheObject.createdAt;
  delete cacheObject.updatedAt;
  delete cacheObject.__v;

  return cacheObject;
};

const Cache = mongoose.model('Cache', cacheSchema);

module.exports = Cache;
