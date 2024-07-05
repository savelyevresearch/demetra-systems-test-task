import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";
import { UserModule } from "./user/user.module";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisOptions } from "./app.config";
import { User } from "./user/entities/user.entity";
import { ProxyService } from "./proxy/proxy.service";
import { ProxyModule } from "./proxy/proxy.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DATABASE_HOST"),
        port: Number(configService.get<number>("DATABASE_PORT")),
        username: configService.get<string>("DATABASE_USER"),
        password: configService.get<string>("DATABASE_PASSWORD"),
        database: configService.get<string>("DATABASE_NAME"),
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    UserModule,
    CacheModule.register({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProxyService],
})
export class AppModule {}
