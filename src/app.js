require('./db/cacheapidb');

const express = require('express');
const cacheRouter = require('./routers/cache');

const app = express();

app.use(express.json());
app.use(cacheRouter);

module.exports = app;
