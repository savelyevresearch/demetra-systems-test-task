import { Processor } from "@nestjs/bull";
import { UserService } from "./user.service";
import { Job } from "bull";

@Processor("user-status")
export class UserStatusProcessor {
  constructor(private readonly userService: UserService) {}

  async handleUpdateStatus(job: Job) {
    const { userId } = job.data;
    const user = await this.userService.get(userId);

    user.status = true;

    await this.userService.update(user);
  }
}
