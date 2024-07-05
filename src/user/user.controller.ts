import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { AbstractUserController } from "./user.abstract";

/**
 * @description Controller handling user-related HTTP requests
 * @class
 * @implements { AbstractUserController }
 */
@Controller("user")
export class UserController implements AbstractUserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @description Creates a new user
   * @method
   * @public
   * @async
   * @param { UserDto } createUserDto - User data
   * @returns { Promise<User> } - User data from database
   */
  @Post()
  public async create(@Body() createUserDto: UserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /**
   * @description Receives a user by ID
   * @method
   * @public
   * @async
   * @param { number } id - User ID
   * @returns { Promise<User> } - User data from database
   */
  @Get(":id")
  public async findOne(@Param("id", ParseIntPipe) id: number): Promise<User> {
    return this.userService.get(id);
  }
}
