const redis = require("redis");

async function connectToRedis() {
  const redisClient = redis.createClient();
  console.log("Connected to Redis");
  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();

  return redisClient;
}

module.exports = connectToRedis;
