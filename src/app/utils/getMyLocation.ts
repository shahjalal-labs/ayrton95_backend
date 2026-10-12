import redisClient from "./redis";

export const getUserLocationFromRedis = async (userId: string) => {
  const redisGeoKey = "userLocations";
  const location = await redisClient.geopos(redisGeoKey, userId);

  const [geo] = location; // geo is [longitude, latitude] | null

  return {
    location: geo
      ? { longitude: Number(geo[0]), latitude: Number(geo[1]) }
      : null,
  };
};
