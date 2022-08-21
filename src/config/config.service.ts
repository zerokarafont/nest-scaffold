import { Inject, Injectable, Optional, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import type { IEnvConfig, IConfigOptions } from './config.interface';

@Injectable()
export class ConfigService {
  private readonly envConfig: IEnvConfig;

  constructor(@Optional() @Inject('CONFIG_OPTIONS') options?: IConfigOptions) {
    if (typeof process.env.NODE_ENV === 'undefined') {
      throw Error('CLI启动参数缺少环境变量NODE_ENV');
    }
    const filePath = `${
      process.env.NODE_ENV === 'development' ? 'development' : 'prod'
    }.env`;
    const envFile = path.resolve(
      __dirname,
      '../',
      options?.folder || './setting',
      filePath,
    );
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
