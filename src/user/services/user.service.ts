import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config';
import { User } from '../entities/user.entity';
import { SALT } from 'src/constants';
import * as crypto from 'crypto';
import { CreateUserDto, QueryUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['username', 'password'],
    });
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
    await this.userRepository.save(createUser);
    delete createUser.password;
    return createUser;
  }

  async findOne(query: QueryUserDto) {
    const user = await this.userRepository.findOne({ where: query });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return user;
  }

  async findOneWithPass(query: QueryUserDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.username', 'user.password'])
      .where('user.username = :username', { username: query.username })
      .orWhere('user.id = :id', { id: query.id })
      .getOne();
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return user;
  }
}
