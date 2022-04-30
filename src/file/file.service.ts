import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FileQueryDto } from './dto/file.dto';
import { File } from './entities/file.entity';
import { UploadType } from './interfaces/file-type';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
  ) {}

  async create(file: Express.Multer.File, type: UploadType) {
    const { path, filename, size } = file;
    const createFile = this.fileRepository.create({
      path,
      filename,
      size,
      type,
    });
    await this.fileRepository.persistAndFlush(createFile);
    return createFile;
  }

  async update(id: number, file: Express.Multer.File) {
    const findFile = await this.fileRepository.findOne(id);
    if (!findFile) {
      throw new BadRequestException('文件不存在');
    }
    const updateFile = this.fileRepository.assign(findFile, file);
    await this.fileRepository.persistAndFlush(updateFile);
    return updateFile;
  }

  async remove(id: number) {
    const findFile = await this.fileRepository.findOne(id);
    if (!findFile) {
      throw new BadRequestException('文件不存在');
    }
    const removeFile = this.fileRepository.assign(findFile, {
      deletedAt: new Date(),
    });
    await this.fileRepository.persistAndFlush(removeFile);
    return removeFile;
  }

  async queryByPagination(query: FileQueryDto) {
    const { current, pageSize, ...rest } = query;
    const [data, total] = await this.fileRepository.findAndCount(rest, {
      limit: pageSize,
      offset: (current - 1) * pageSize,
    });
    return {
      list: data,
      pagination: {
        current,
        pageSize,
        total,
      },
    };
  }
}
