import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>, @InjectQueue("user-status") private userStatusQueue: Queue) {}

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
}
