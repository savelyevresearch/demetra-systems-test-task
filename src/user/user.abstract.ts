import { Job } from "bull";
import { UserDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";

/**
 * @description Abstract class for UserService
 * @abstract
 * @class
 */
export abstract class AbstractUserService {
  public abstract create(createUserDto: UserDto): Promise<User>;
  public abstract get(id: number): Promise<User>;
  public abstract update(user: UserDto): Promise<void>;
}

/**
 * @description Abstract class for UserController
 * @abstract
 * @class
 */
export abstract class AbstractUserController {
  public abstract create(createUserDto: UserDto): Promise<User>;
  public abstract findOne(id: number): Promise<User>;
}

/**
 * @description Abstract class for UserStatusProcessor
 * @abstract
 * @class
 */
export abstract class AbstractUserStatusProcessor {
  public abstract handleUpdateStatus(job: Job): Promise<void>;
}
