import {resetRateLimiterStores} from '../backend/src/middlewares/rateLimiter.js';

beforeEach(async () => {
  await resetRateLimiterStores();
});
