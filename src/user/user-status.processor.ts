import { Process, Processor } from "@nestjs/bull";
import { UserService } from "./user.service";
import { Job } from "bull";
import { Logger } from "@nestjs/common/services";
import { AbstractUserStatusProcessor } from "./user.abstract";

/**
 * @description Processor for handling user-related jobs
 * @class
 * @implements { AbstractUserStatusProcessor }
 */
@Processor("user-status")
export class UserStatusProcessor implements AbstractUserStatusProcessor {
  private readonly logger = new Logger(UserStatusProcessor.name);

  constructor(private readonly userService: UserService) {}

  @Process("update-status")
  async handleUpdateStatus(job: Job): Promise<void> {
    const { userId } = job.data;

    this.logger.log(`Updating status for a user with ID ${userId}`);

    const user = await this.userService.get(userId);

    user.status = true;

    await this.userService.update(user);

    this.logger.log(`User with ID ${userId} is activated`);
  }
}
