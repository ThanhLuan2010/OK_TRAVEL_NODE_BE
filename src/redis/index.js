const { default: Redlock } = require('redlock');
const Redis = require('ioredis');
const logger = require('../config/logger');
const config = require('../config/config');

let redisClient;

if (config.redis.host) {
  redisClient = new Redis(config.redis);
} else {
  // connect local
  redisClient = new Redis();
}

// Lắng nghe sự kiện 'connect'
redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

// Lắng nghe sự kiện 'ready'
redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

// Lắng nghe sự kiện 'error'
redisClient.on('error', (err) => {
  logger.error(`Redis client error:, ${err.message}`);
});

// Lắng nghe sự kiện 'end'
redisClient.on('end', () => {
  logger.info('Redis connection closed');
});

const redlock = new Redlock([redisClient], {
  // The expected clock drift; for more details see:
  // http://redis.io/topics/distlock
  driftFactor: 0.01, // multiplied by lock ttl to determine drift time

  // The max number of times Redlock will attempt to lock a resource
  // before erroring.
  retryCount: 3,

  // the time in ms between attempts
  retryDelay: 200, // time in ms

  // the max time in ms randomly added to retries
  // to improve performance under high contention
  // see https://www.awsarchitectureblog.com/2015/03/backoff.html
  retryJitter: 200, // time in ms

  // The minimum remaining time on a lock before an extension is automatically
  // attempted with the `using` API.
  automaticExtensionThreshold: 500, // time in ms
});

redlock.on('clientError', function (err) {
  logger.error(`A redis error has occurred: ${err.message}`);
});

const get = async (key) => {
  try {
    const data = await redisClient.get(`gfx:${key}`);
    return data;
  } catch (e) {
    logger.error(`ERR get Redis: ${e.message}`);
  }
};

const set = async (key, value) => {
  try {
    const data = await redisClient.set(`gfx:${key}`, value);
    return data;
  } catch (e) {
    logger.error(`ERR set Redis: ${e.message}`);
  }
};

const del = async (key) => {
  try {
    const data = await redisClient.del(`gfx:${key}`);
    return data;
  } catch (e) {
    logger.error(`ERR del Redis: ${e.message}`);
  }
};

const watchAndIncr = async (key, amount) => {
  try {
    if (amount < 0) {
      logger.error(`ERR watchAndIncr Redis: ${amount} must be positive`);
      return;
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const watch = await redisClient.watch(`gfx:${key}`);
    if (!watch) {
      logger.error(`Watch failed key: gfx:${key}`);
      return;
    }

    const value = await redisClient.get(`gfx:${key}`);
    if (!value) {
      logger.error(`Get failed key: gfx:${key}`);
      return;
    }

    const results = await redisClient.multi().incrby(`gfx:${key}`, parseInt(amount, 10)).exec();
    if (results === null) {
      logger.error(`Transaction aborted due to concurrent modification`);
    } else {
      logger.info(`Transaction successful, new value: ${results[0][1]}`);
      return Number(results[0][1]);
    }
  } catch (e) {
    logger.error(`ERR watchAndIncr: ${e.message}`);
  }
};

const watchAndDecr = async (key, amount) => {
  try {
    if (amount < 0) {
      logger.error(`ERR watchAndDecr Redis: ${amount} must be positive`);
      return;
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const watch = await redisClient.watch(`gfx:${key}`);
    if (!watch) {
      logger.error(`Watch failed key: gfx:${key}`);
      return;
    }

    const value = await redisClient.get(`gfx:${key}`);
    if (!value) {
      logger.error(`Get failed key: gfx:${key}`);
      return;
    }
    if (Number(value - amount) < 0) {
      logger.error(`Value of key gfx:${key} less than 0`);
      return;
    }

    const results = await redisClient.multi().decrby(`gfx:${key}`, parseInt(amount, 10)).exec();
    if (results === null) {
      logger.error(`Transaction aborted due to concurrent modification`);
    } else {
      logger.info(`Transaction successful, new value: ${results[0][1]}`);
      return Number(results[0][1]);
    }
  } catch (e) {
    logger.error(`ERR watchAndIncr: ${e.message}`);
  }
};

module.exports = {
  redisClient,
  redlock,
  get,
  set,
  del,
  watchAndIncr,
  watchAndDecr,
};
