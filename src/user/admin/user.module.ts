import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AdminUserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [AdminUserController],
  providers: [UserService],
  exports: [UserService],
})
export class AdminUserModule {}
