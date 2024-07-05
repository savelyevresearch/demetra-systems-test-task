import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";

/**
 * @description Options for connecting to Redis
 */
export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>("REDIS_HOST"),
        port: Number(configService.get<string>("REDIS_PORT")),
      },
    });

    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
