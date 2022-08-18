import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileIPFSController } from './file-ipfs.controller';
import { FileService } from '../../file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../../entities/file.entity';
import PinataEngine, { PinataStorage } from './pinata.storage';

@Module({
  imports: [
    MulterModule.register({ storage: PinataEngine }),
    TypeOrmModule.forFeature([File]),
  ],
  controllers: [FileIPFSController],
  providers: [FileService, PinataStorage],
  exports: [FileService],
})
export class FileIPFSModule {}
