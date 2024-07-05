import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { AbstractUserService } from "./user.abstract";

/**
 * @description Business-logic for user-related operations
 * @class
 * @implements { AbstractUserService }
 */
@Injectable()
export class UserService implements AbstractUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectQueue("user-status") private userStatusQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * @description Creates a mew user
   * @method
   * @public
   * @async
   * @param { UserDto } createUserDto - User data
   * @returns { Promise<User> } - User data from database
   */
  public async create(createUserDto: UserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException("ERR_USER_EMAIL_EXISTS");
    }

    const user = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(user);

    await this.userStatusQueue.add(
      "update-status",
      { userId: user.id },
      { delay: 10000 },
    );

    return user;
  }

  /**
   * @description Receives a user by ID
   * @method
   * @public
   * @async
   * @param { number } id - User ID
   * @returns { Promise<User> } - User data from database
   */
  public async get(id: number): Promise<User> {
    const cachedUser = (await this.cacheManager.get(`user-${id}`)) as User;

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException("ERR_USER_NOT_FOUND");
    }

    await this.cacheManager.set(`user-${id}`, user, 1800);

    return user;
  }

  /**
   * @description Updates user data
   * @method
   * @public
   * @async
   * @param { UserDto } user - User data
   * @returns { Promise<void> }
   */
  public async update(user: UserDto): Promise<void> {
    await this.usersRepository.save(user);
  }
}
