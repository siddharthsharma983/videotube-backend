import Redis from "ioredis";

let redis = null;

try {
  redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
  });

  redis.on("connect", () => {
    console.log("✅ Redis connected");
  });

  redis.on("error", () => {
    redis = null;
  });
} catch (error) {
  redis = null;
}

export default redis;
