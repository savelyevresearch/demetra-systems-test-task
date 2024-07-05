import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { BullModule, getQueueToken } from "@nestjs/bull";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Queue } from "bull";

/**
 * @description Tests for UserService
 */
describe("UsersService", () => {
  let service: UserService;
  let repository: Repository<User>;
  let cacheManager: any;
  let bullQueue: Queue;

  /**
   * @description Sets up the testing module with necessary mocks and dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: "user-status" })],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockImplementation((user) => user),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: getQueueToken("user-status"),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    cacheManager = module.get(CACHE_MANAGER);
    bullQueue = module.get(getQueueToken("user-status"));
  });

  /**
   * @description Clears mocks after each test
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * @description Tests if the UserService is defined
   */
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  /**
   * @description Tests if an error is thrown when creating a user with an existing email
   */
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

  /**
   * @description Tests if a user is created successfully when the email does not exist
   */
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
