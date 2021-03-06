import Redis from 'ioredis';
import { logger } from '../logger';

export const RedisClient = (function RedisClinet() {
  let client = null;

  async function createClient(redisConnectionUri, { debug } = {}) {
    if (client) {
      throw new Error('RedisClinet is Singleton!');
    }

    client = await new Redis(redisConnectionUri);

    return new Promise((resolve) => {
      client.on('connect', () => {
        if (debug) {
          logger.success('Redis connected to: ', redisConnectionUri);
        }
        resolve(client);
      });
    });
  }

  function getInstance() {
    if (!client) {
      throw new Error('Try to get RedisClient before Init');
    }

    return client;
  }

  async function flush() {
    const instance = await getInstance();
    instance.flushall();
  }

  return {
    createClient,
    getInstance,
    flush,
  };
}());
