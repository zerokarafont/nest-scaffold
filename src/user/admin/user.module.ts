import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AdminUserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminUserController],
  providers: [UserService],
  exports: [UserService],
})
export class AdminUserModule {}
