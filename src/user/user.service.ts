import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectQueue("user-status") private userStatusQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });

    if (existingUser) {
      throw new BadRequestException("ERR_USER_EMAIL_EXISTS");
    }

    const user = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(user);

    await this.userStatusQueue.add('update-status', { userId: user.id }, { delay: 10000 });

    return user;
  }

  async get(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException("ERR_USER_NOT_FOUND");
    }

    await this.cacheManager.set(`user-${id}`, user, 1800);

    return user;
  }
}
