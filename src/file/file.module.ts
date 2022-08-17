import { Module } from '@nestjs/common';
import { FileLocalModule, FileIPFSModule, FileArweaveModule } from './strategy';

@Module({
  imports: [FileLocalModule, FileIPFSModule, FileArweaveModule],
  controllers: [],
  providers: [],
})
export class FileModule {}
