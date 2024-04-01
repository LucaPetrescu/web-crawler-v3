async function cacheUrl(redisClient, url, result) {
  const cacheKey = `url:${url}`;
  const timeInSeconds = 300;
  await redisClient.set(cacheKey, JSON.stringify(result), "EX", timeInSeconds);
}

async function getCachedUrl(redisClient, url) {
  const cacheKey = `url:${url}`;
  const result = await redisClient.get(cacheKey);
  return result;
}

module.exports = { cacheUrl, getCachedUrl };
