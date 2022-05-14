import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FileQueryDto } from './dto/file.dto';
import { File } from './entities/file.entity';
import { UploadType } from './interfaces/file-type';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(file: Express.Multer.File, type: UploadType) {
    const { path, filename, size } = file;
    const createFile = this.fileRepository.create({
      path,
      filename,
      size,
      type,
    });
    await this.fileRepository.save(createFile);
    return createFile;
  }

  async update(id: number, file: Express.Multer.File) {
    const findFile = await this.fileRepository.findOne(id);
    if (!findFile) {
      throw new BadRequestException('文件不存在');
    }
    const updateFile = Object.assign(findFile, file);
    await this.fileRepository.save(updateFile);
    return updateFile;
  }

  async remove(id: number, soft = true) {
    const findFile = await this.fileRepository.findOne(id);
    if (!findFile) {
      throw new BadRequestException('文件不存在');
    }
    if (!soft) {
      const removeFile = Object.assign(findFile, {
        deletedAt: new Date(),
      });
      await this.fileRepository.save(removeFile);
      return removeFile;
    }
    await this.fileRepository.softRemove(findFile);
    return findFile;
  }

  async queryByPagination(query: FileQueryDto) {
    const { current, pageSize, ...rest } = query;
    // const [data, total] = await this.fileRepository.findAndCount(rest, {
    //   limit: pageSize,
    //   offset: (current - 1) * pageSize,
    // });
    const [data, total] = await this.fileRepository.findAndCount({
      where: rest,
      take: pageSize,
      skip: (current - 1) * pageSize,
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
