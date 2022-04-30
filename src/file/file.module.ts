import { Module } from '@nestjs/common';
import { FileLocalModule } from './file-local.module';

@Module({
  imports: [FileLocalModule],
  controllers: [],
  providers: [],
})
export class FileModule {}
