import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProxyService } from "./proxy.service";
import { ProxyController } from "./proxy.controller";

@Module({
  imports: [ConfigModule],
  providers: [ProxyService],
  controllers: [ProxyController],
})
export class ProxyModule {}
