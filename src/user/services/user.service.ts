import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config';
import { User } from '../entities/user.entity';
import { SALT } from 'src/constants';
import * as crypto from 'crypto';
import { FilterQuery } from '@mikro-orm/core';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const user = await this.userRepository.findOne({ username });
    if (user) {
      throw new BadRequestException('该用户名已存在');
    }
    const salt = this.configService.get(SALT);
    const hash = crypto.createHash('sha256');
    hash.update(`${password}${salt}`);
    const cryptoPass = hash.digest('hex');
    const createUser = this.userRepository.create({
      username,
      password: cryptoPass,
    });
    await this.userRepository.persistAndFlush(createUser);
    return createUser;
  }

  async findOne(query: FilterQuery<User>) {
    const user = await this.userRepository.findOne(query);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return user;
  }
}
