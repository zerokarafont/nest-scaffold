import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileIPFSController } from './file-ipfs.controller';
import { FileService } from '../../file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../../entities/file.entity';
import { PinataStorage } from './pinata.storage';
import { ConfigService } from 'src/config';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: new PinataStorage(config),
      }),
    }),
    TypeOrmModule.forFeature([File]),
  ],
  controllers: [FileIPFSController],
  providers: [FileService],
  exports: [FileService],
})
export class FileIPFSModule {}
