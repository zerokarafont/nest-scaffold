import { PINATA_API_KEY, PINATA_SECRET_API_KEY } from 'src/constants';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { IPFS_GATEWAY } from 'src/constants';
import { ConfigService } from 'src/config';
import pinataSDK, { PinataClient } from '@pinata/sdk';
import { Readable } from 'stream';
import { join } from 'path';

@Injectable()
export class PinataStorage {
  private pinata: PinataClient;

  constructor(private readonly configService?: ConfigService) {
    this.initialize();
  }

  private initialize() {
    const API_KEY = this.configService.get(PINATA_API_KEY);
    const SECRET_KEY = this.configService.get(PINATA_SECRET_API_KEY);
    this.pinata = pinataSDK(API_KEY, SECRET_KEY);
    this.pinata
      .testAuthentication()
      .then(({ authenticated }) => {
        if (authenticated) {
          Logger.log('Pinata SDK authenticated successfully');
        } else {
          throw new ServiceUnavailableException(
            'pinata sdk authenticated failed',
          );
        }
      })
      .catch((err) => {
        throw new ServiceUnavailableException(err);
      });
  }

  _handleFile(req, file: Express.Multer.File, cb) {
    const { buffer } = file;
    const readable = Readable.from(buffer.toString());
    this.pinata
      .pinFileToIPFS(readable)
      .then((result) => {
        const { IpfsHash } = result;
        const gateway = this.configService.get(IPFS_GATEWAY);
        const path = join(gateway, IpfsHash);
        cb(null, {
          path,
        });
      })
      .catch((err) => {
        Logger.error(err);
        throw new BadRequestException('上传失败');
      });
  }

  _removeFile(req, file: Express.Multer.File, cb) {
    delete file.buffer;
    cb(null);
  }
}

export default function () {
  return new PinataStorage();
}
