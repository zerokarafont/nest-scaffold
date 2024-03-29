import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth';
import { FileUploadDto, FileQueryDto } from '../../dto/file.dto';
import { FileService } from '../../file.service';
import { UploadType } from '../../interfaces/file-type';

@ApiTags('file')
@ApiCookieAuth()
@UseGuards(SessionAuthGuard)
@Controller('file/ipfs')
export class FileIPFSController {
  constructor(private readonly fileService: FileService) {}

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传单个文件到服务器' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.create(file, UploadType.IPFS);
  }

  @Post('updateFile/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '更新单个文件到服务器' })
  @ApiConsumes('multipart/form-data')
  async updateFile(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.update(id, file);
  }

  @Get('list')
  @ApiOperation({ summary: '分页查询文件' })
  async queryFilesByPagination(@Query() query: FileQueryDto) {
    return await this.fileService.queryByPagination({
      ...query,
      type: UploadType.IPFS,
    });
  }
}
