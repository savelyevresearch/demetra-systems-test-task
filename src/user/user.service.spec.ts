// src/users/users.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";

describe("UsersService", () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new user", async () => {
    const createUserDto: UserDto = {
      name: "Test User",
      email: "test@example.com",
      password: "password",
    };

    jest.spyOn(repository, "findOne").mockResolvedValue(undefined); // Mock repository method

    const newUser = await service.create(createUserDto);
    expect(newUser).toBeDefined();
    expect(newUser.name).toBe(createUserDto.name);
    expect(newUser.email).toBe(createUserDto.email);
    expect(newUser.password).toBe(createUserDto.password);
  });

  it("should throw an error if email already exists", async () => {
    const createUserDto: UserDto = {
      name: "Test User",
      email: "existing@example.com",
      password: "password",
    };

    const existingUser = new User();
    existingUser.name = createUserDto.name;
    existingUser.email = createUserDto.email;
    existingUser.password = createUserDto.password;

    jest.spyOn(repository, "findOne").mockResolvedValue(existingUser); // Mock repository method

    try {
      await service.create(createUserDto);
    } catch (error) {
      expect(error.message).toBe("ERR_USER_EMAIL_EXISTS");
    }
  });
});
