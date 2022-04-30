import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { FileLocalController } from './file-local.controller';
import { FileService } from './file.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { File } from './entities/file.entity';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dateStr = new Date().toLocaleDateString().split('/').join('-');
    const base = path.resolve(__dirname, '..', 'upload/');
    const dest = path.resolve(base, dateStr);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    /**
     * @description 同名文件直接覆盖
     */
    cb(null, file.originalname);
  },
});

@Module({
  imports: [
    MulterModule.register({ storage: storage }),
    MikroOrmModule.forFeature([File]),
  ],
  controllers: [FileLocalController],
  providers: [FileService],
})
export class FileLocalModule {}
