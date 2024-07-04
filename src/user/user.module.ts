import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({ name: "user-status" }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
