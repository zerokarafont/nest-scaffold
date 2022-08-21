import { Module } from '@nestjs/common';
import { FileLocalModule, FileIPFSModule } from './strategy';

@Module({
  imports: [FileLocalModule, FileIPFSModule],
  controllers: [],
  providers: [],
})
export class FileModule {}
